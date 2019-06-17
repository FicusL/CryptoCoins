import { AxiosWrapper } from '../../../../../Shared/services/AxiosWrapper';
import { inject, injectable } from 'inversify';
import { action, observable } from 'mobx';
import { CustomerInformationStore } from './parts/CustomerInformationStore';
import { RepresentativeDataStore } from './parts/RepresentativeDataStore';
import { ManagementPersonalDataStore } from './parts/ManagementPersonalDataStore';
import { BeneficiariesDataStore } from './parts/BeneficiariesDataStore';
import { MainPartnersStore } from './parts/MainPartnersStore';
import { OtherInfoStore } from './parts/OtherInfoStore';
import { AccountStore } from '../../../Profile/stores/AccountStore';
import { SessionStore } from '../../../../../Shared/stores/SessionStore';
import { ModalStore } from '../../../../../Modals/store/ModalStore';
import { KycStatus } from '../../../Profile/constants/KycStatus';
import { LoaderStore } from '../../../../../Shared/modules/Loader/store/LoaderStore';

@injectable()
export class LegalVerificationStore {
  private static readonly LEGAL_VERIFICATION_TIER_1_SEND_TASK = 'LEGAL_VERIFICATION_TIER_1_SEND_TASK';

  @inject(AxiosWrapper)
  axiosWrapper: AxiosWrapper;

  @inject(AccountStore)
  accountStore: AccountStore;

  @inject(SessionStore)
  sessionStore: SessionStore;

  @inject(ModalStore)
  modalStore: ModalStore;

  @inject(LoaderStore)
  loaderStore: LoaderStore;

  @inject(CustomerInformationStore)
  customerInformationStore: CustomerInformationStore;

  @inject(RepresentativeDataStore)
  representativeDataStore: RepresentativeDataStore;

  @inject(ManagementPersonalDataStore)
  managementPersonalDataStore: ManagementPersonalDataStore;

  @inject(BeneficiariesDataStore)
  beneficiariesDataStore: BeneficiariesDataStore;

  @inject(MainPartnersStore)
  mainPartnersStore: MainPartnersStore;

  @inject(OtherInfoStore)
  otherInfoStore: OtherInfoStore;

  steps = [
    'dashboard.kyc.legal.step.1',
    'dashboard.kyc.legal.step.2',
    'dashboard.kyc.legal.step.3',
    'dashboard.kyc.legal.step.4',
    'dashboard.kyc.legal.step.5',
    'dashboard.kyc.legal.step.6',
  ];

  constructor() {
    // hydrate('customer', this.customer);
  }

  @observable step = 0;

  getCurrentStepStore() {
    switch (this.step) {
      case 0: return this.customerInformationStore;
      case 1: return this.representativeDataStore;
      case 2: return this.managementPersonalDataStore;
      case 3: return this.beneficiariesDataStore;
      case 4: return this.mainPartnersStore;
      case 5: return this.otherInfoStore;

      default: throw new Error('Step out of range');
    }
  }

  @action
  nextStep() {
    return new Promise((resolve, reject) => {
      this.getCurrentStepStore().validate().then(action((result) => {
        if (result) {
          this.step++;
          resolve();
          return;
        }

        reject();
      }));
    });
  }

  @action
  prevStep = () => --this.step;

  private getFormData(): FormData {
    const result = new FormData();

    const { registrationDate } = this.customerInformationStore.values;
    const customerInformationJSON = JSON.stringify({
      ...this.customerInformationStore.values,
      registrationDate: registrationDate && registrationDate.toDateString(),
    });

    const { issueDate, expirationDate, dateOfBirth } = this.representativeDataStore.values;
    const representativeDataJSON = JSON.stringify({
      ...this.representativeDataStore.values,
      issueDate: issueDate && issueDate.toDateString(),
      expirationDate: expirationDate && expirationDate.toDateString(),
      dateOfBirth: dateOfBirth && dateOfBirth.toDateString(),
    });

    const managementPersonalDataJSON = JSON.stringify(this.managementPersonalDataStore.values);
    const beneficiariesDataJSON = JSON.stringify(this.beneficiariesDataStore.values);
    const mainPartnersJSON = JSON.stringify(this.mainPartnersStore.values);
    const otherInfoJSON = JSON.stringify(this.otherInfoStore.values);

    result.set('customerInformation', customerInformationJSON);
    result.set('representativeData', representativeDataJSON);
    result.set('managementPersonalData', managementPersonalDataJSON);
    result.set('beneficiariesData', beneficiariesDataJSON);
    result.set('mainPartners', mainPartnersJSON);
    result.set('otherInfo', otherInfoJSON);

    // TODO: Documents

    return result;
  }

  @action
  submit = async () => {
    const isValid = await this.otherInfoStore.validate();
    if (isValid) {
      const accountId = this.sessionStore.accountId;
      const payload = this.getFormData();

      this.loaderStore.addTask(LegalVerificationStore.LEGAL_VERIFICATION_TIER_1_SEND_TASK);

      this.axiosWrapper.post(`/account/${accountId}/kyc/legal`, payload).then(
        action<any>(result => {
          this.modalStore.openModal(
            'TIER1_SUBMIT',
            {description: 'The review process can take up to 3 days. ' +
                'You will be notified via email when your application is approved. ' +
                'If it gets declined, you will be notified with a list of further steps.',
            });

          this.accountStore.setKYCStatus(KycStatus.Tier1Pending);
          this.loaderStore.removeTask(LegalVerificationStore.LEGAL_VERIFICATION_TIER_1_SEND_TASK);
        }),

        action<any>(reason => {
          this.modalStore.openModal(
            'ERROR',
            {description: 'Something going wrong during application send. \n' +
                'Please, try again or contact us. ',
            });

          this.loaderStore.removeTask(LegalVerificationStore.LEGAL_VERIFICATION_TIER_1_SEND_TASK);
        }),
      );
    }
  }
}
