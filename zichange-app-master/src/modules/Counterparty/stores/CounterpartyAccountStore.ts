import { action, observable } from 'mobx';
import { inject, injectable } from 'inversify';
import { AxiosWrapper } from '../../Shared/services/AxiosWrapper';
import { LoaderStore } from '../../Shared/modules/Loader/store/LoaderStore';

export const REQUEST_AGENT_EMAIL = 'REQUEST_AGENT_EMAIL';
export const REQUEST_GET_TRANSACTION = 'REQUEST_GET_TRANSACTION';

@injectable()
export class CounterpartyAccountStore {
  @inject(AxiosWrapper)
  api: AxiosWrapper;

  @inject(LoaderStore)
  loaderStore: LoaderStore;

  @observable accountId: number = 0;
  @observable token: string = '';
  @observable referenceId: string = '';
  @observable isAgent: boolean = false;
  @observable email: string = '';
  @observable activateCode: string = '';

  @observable fee: string = '';
  @observable get: string = '';
  @observable exchangeRate: string = '';
  @observable pay: string = '';
  @observable wallet: string = '';

  @observable status: string = '';

  @action
  async sendCode() {
    await this.api.post(`/account/counterparties/${this.token}/send_code`);
  }

  @action
  async getEmail() {
    this.loaderStore.addTask(REQUEST_AGENT_EMAIL);

    const { email } = await this.api.get(`/account/counterparties/${this.token}/email`);
    this.email = email;

    this.loaderStore.removeTask(REQUEST_AGENT_EMAIL);
  }

  @action
  async getTransaction() {
    this.loaderStore.addTask(REQUEST_GET_TRANSACTION);
    try {
      const transaction = await this.api.get(`/account/counterparties/${this.token}`);

      this.wallet = transaction.counterpartyWallet;
      this.fee = transaction.counterpartyFee;
      this.exchangeRate = transaction.exchange.reverseRate;
      this.get = transaction.withdrawal.amount;
      this.pay = transaction.deposit.amount;
      this.status = transaction.status;

      this.loaderStore.removeTask(REQUEST_GET_TRANSACTION);
    } catch (e) {
      this.loaderStore.removeTask(REQUEST_GET_TRANSACTION);
    }
  }
}
