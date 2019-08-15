import { action, computed, observable } from 'mobx';
import { inject, injectable } from 'inversify';
import { AxiosWrapper } from '../../../../../Shared/services/AxiosWrapper';
import { PersonalInformationStore, PersonalInformationValues } from './parts/PersonalInformationStore';
import { DocumentsStore, DocumentsValues } from './parts/DocumentsStore';
import {
  BeneficiariesAndRepresentativesStore,
  BeneficiariesAndRepresentativesValues,
} from './parts/BeneficiariesAndRepresentativesStore';
import { ConfirmationStore, ConfirmationValues } from './parts/ConfirmationStore';
import { ModalStore } from '../../../../../Modals/store/ModalStore';
import { SessionStore } from '../../../../../Shared/stores/SessionStore';
import { AccountStore } from '../../../Profile/stores/AccountStore';
import { KycStatus } from '../../../Profile/constants/KycStatus';
import { BaseFormStore } from '../../../../../Shared/stores/Forms/BaseFormStore';
import { LoaderStore } from '../../../../../Shared/modules/Loader/store/LoaderStore';
import { CounterpartyAccountStore } from '../../../../../Counterparty/stores/CounterpartyAccountStore';
import { TransactionProgressStore } from '../../../../../Counterparty/components/TransactionProgess/stores/TransactionProgressStore';
import { KycDataStore } from './KycDataStore';

export enum Tier1Steps {
  PersonalInformation,
  BeneficiariesAndRepresentatives,
  Documents,
  Confirmation,
}

@injectable()
export class Tier1Store {
  private static readonly NATURAL_VERIFICATION_TIER_1_SEND_TASK = 'NATURAL_VERIFICATION_TIER_1_SEND_TASK';

  @inject(AxiosWrapper)
  private readonly axiosWrapper: AxiosWrapper;

  @inject(AccountStore)
  private readonly accountStore: AccountStore;

  @inject(SessionStore)
  private readonly sessionStore: SessionStore;

  @inject(ModalStore)
  private readonly modalStore: ModalStore;

  @inject(LoaderStore)
  private readonly loaderStore: LoaderStore;

  @inject(KycDataStore)
  private readonly kycDataStore: KycDataStore;

  @inject(PersonalInformationStore)
  private readonly personalInformationStore: PersonalInformationStore;

  @inject(BeneficiariesAndRepresentativesStore)
  private readonly beneficiariesAndRepresentativesStore: BeneficiariesAndRepresentativesStore;

  @inject(DocumentsStore)
  private readonly documentsStore: DocumentsStore;

  @inject(ConfirmationStore)
  private readonly confirmationStore: ConfirmationStore;

  @inject(CounterpartyAccountStore)
  counterpartyAccountStore: CounterpartyAccountStore;

  @inject(TransactionProgressStore)
  transactionProgressStore: TransactionProgressStore;

  readonly stepsCount = 4;
  @observable private _step: Tier1Steps = Tier1Steps.PersonalInformation;

  @computed
  get step() { return this._step; }

  private getCurrentStepStore = (): BaseFormStore<
    PersonalInformationValues | BeneficiariesAndRepresentativesValues | DocumentsValues | ConfirmationValues
    > => {
    switch (this.step) {
      case Tier1Steps.PersonalInformation: return this.personalInformationStore;
      case Tier1Steps.BeneficiariesAndRepresentatives: return this.beneficiariesAndRepresentativesStore;
      case Tier1Steps.Documents: return this.documentsStore;
      case Tier1Steps.Confirmation: return this.confirmationStore;
    }
  };

  @action
  nextStep() {
    return new Promise((resolve, reject) => {
      this.getCurrentStepStore().validate().then(action((result) => {
        if (result) {
          ++this._step;
          resolve();
          return;
        }

        reject();
      }));
    });
  }

  @action
  prevStep = () => --this._step;

  private getFormData(): FormData {
    const result = new FormData();
    // Apply general data
    const { birthDate } = this.personalInformationStore.values;
    const personalInformationJSON = JSON.stringify({
      ...this.personalInformationStore.values,
      birthDate: birthDate && birthDate.toDateString(),
      documentType: this.documentsStore.values.documentType,
      documentIsDoubleSided: this.documentsStore.values.documentIsDoubleSided,
    });

    const { beneficBirthDate3Party, beneficBirthDateUltBeneficiary } = this.beneficiariesAndRepresentativesStore.values;
    const beneficiariesAndRepresentativesJSON = JSON.stringify({
      ...this.beneficiariesAndRepresentativesStore.values,
      beneficBirthDate3Party: beneficBirthDate3Party && beneficBirthDate3Party.toDateString(),
      beneficBirthDateUltBeneficiary: beneficBirthDateUltBeneficiary && beneficBirthDateUltBeneficiary.toDateString(),
    });

    result.set('personalInformation', personalInformationJSON);
    result.set('beneficiariesAndRepresentatives', beneficiariesAndRepresentativesJSON);

    // Apply documents
    for (const key in this.documentsStore.values) {
      if (this.documentsStore.values.hasOwnProperty(key)) {
        result.set(key, this.documentsStore.values[key]);
      }
    }

    return result;
  }

  private getDataKyc() {
    return {
      personalInfromation: this.personalInformationStore.values,
      beneficiariesAndRepresentatives: this.beneficiariesAndRepresentativesStore.values,
      documents: this.documentsStore.values.documentType,
      confirmation: this.confirmationStore.values,
    };
  }

  @action
  submit = async () => {
    const isValid = await this.confirmationStore.validate();
    if (!isValid) {
      throw new Error();
    }

    if (isValid) {
      const accountId = this.sessionStore.accountId;
      const payload = this.getFormData();
      const dataKyc = this.getDataKyc();

      this.loaderStore.addTask(Tier1Store.NATURAL_VERIFICATION_TIER_1_SEND_TASK);
      await this.kycDataStore.loadToDataBase(dataKyc);

      if (this.counterpartyAccountStore.isAgent) {
        await this.axiosWrapper.post(`/account/counterparties/${this.counterpartyAccountStore.token}/kyc/natural`, payload);
        await this.transactionProgressStore.currentStep();

        this.loaderStore.removeTask(Tier1Store.NATURAL_VERIFICATION_TIER_1_SEND_TASK);

      } else {
        this.axiosWrapper.post(`/account/${accountId}/kyc/natural`, payload).then(
          action<any>(() => {
            this.modalStore.openModal(
              'TIER1_SUBMIT',
              {description: 'The review process can take up to 3 days. ' +
                  'You will be notified via email when your application is approved. ' +
                  'If it gets declined, you will be notified with a list of further steps.',
              });

            this.accountStore.setKYCStatus(KycStatus.Tier1Pending);
            this.loaderStore.removeTask(Tier1Store.NATURAL_VERIFICATION_TIER_1_SEND_TASK);
          }),

          action<any>(() => {
            this.modalStore.openModal(
              'ERROR',
              {description: 'Something going wrong during application send. \n' +
                  'Please, try again or contact us. ',
              });

            this.loaderStore.removeTask(Tier1Store.NATURAL_VERIFICATION_TIER_1_SEND_TASK);
          }),
        );
      }
    }
  }
}