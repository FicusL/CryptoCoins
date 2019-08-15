import { inject, injectable } from 'inversify';
import { action, observable } from 'mobx';
import { AxiosWrapper } from '../../../../Shared/services/AxiosWrapper';
import { CounterpartyAccountStore } from '../../../stores/CounterpartyAccountStore';
import { CounterpartyTransactionSteps } from '../const/CounterpartyTransactionSteps';
import { LoaderStore } from '../../../../Shared/modules/Loader/store/LoaderStore';

export const REQUEST_CURRENT_STEP = 'REQUEST_CURRENT_STEP';

@injectable()
export class TransactionProgressStore {

  @inject(AxiosWrapper)
  api: AxiosWrapper;

  @inject(CounterpartyAccountStore)
  accountStore: CounterpartyAccountStore;

  @inject(LoaderStore)
  loaderStore: LoaderStore;

  @observable stepIndex: number = 0;
  @observable step: string = '';

  @action
  async currentStep() {
    this.loaderStore.addTask(REQUEST_CURRENT_STEP);

    await this.api.get(`/account/counterparties/${this.accountStore.token}/step`)
      .then(({ step }) => {
      if (step !== CounterpartyTransactionSteps.NotActivated) {
        this.accountStore.getEmail();
      }
      if (step === CounterpartyTransactionSteps.NotActivated) {
        this.stepIndex = 0;
      } else if (step === CounterpartyTransactionSteps.NotKyc || step === CounterpartyTransactionSteps.KycRejected) {
        this.stepIndex = 1;
      } else if (step === CounterpartyTransactionSteps.KycPending) {
        this.stepIndex = 1;
        this.step = CounterpartyTransactionSteps.KycPending;
      } else if (step === CounterpartyTransactionSteps.TransactionPending) {
        this.stepIndex = 2;
      } else if (step === CounterpartyTransactionSteps.TransactionCompleted
        || step === CounterpartyTransactionSteps.TransactionRejected) {
        this.stepIndex = 3;
      }

      this.loaderStore.removeTask(REQUEST_CURRENT_STEP);
    }).catch(() => this.loaderStore.removeTask(REQUEST_CURRENT_STEP));
  }

}