import { inject, injectable } from 'inversify';
import { action, observable } from 'mobx';
import { AxiosWrapper } from '../../../../Shared/services/AxiosWrapper';
import { CounterpartyAccountStore } from '../../../stores/CounterpartyAccountStore';

@injectable()
export class VerificationStore {

  @inject(AxiosWrapper)
  api: AxiosWrapper;

  @inject(CounterpartyAccountStore)
  accountStore: CounterpartyAccountStore;

  @observable kycRejectedMessage: string = '';

  @action
  async getKyc() {
    try {
      const kyc = await this.api.get(`/account/counterparties/${this.accountStore.token}/kyc`);
      console.log('kyc: ', kyc);
      this.kycRejectedMessage = kyc.rejectReason;
    } catch (e) {
      console.log(e.message);
    }

  }
}
