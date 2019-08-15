import { inject, injectable } from 'inversify';
import { AxiosWrapper } from '../../../../Shared/services/AxiosWrapper';
import { action, observable } from 'mobx';
import { SessionStore } from '../../../../Shared/stores/SessionStore';
import { CounterpartyAccountStore } from '../../../../Counterparty/stores/CounterpartyAccountStore';

@injectable()
export class UploadStore {
  @inject(AxiosWrapper)
  api: AxiosWrapper;

  @inject(SessionStore)
  store: SessionStore;

  @inject(CounterpartyAccountStore)
  counterpartyAccountStore: CounterpartyAccountStore;

  @observable file: string = '';
  @observable logoIsLoaded: boolean = false;

  @action
  async getLogo() {
    try {
      await this.api.get(`/counterparties/${this.counterpartyAccountStore.accountId}/logo`);
      this.logoIsLoaded = true;
    }
    catch (e) {
      this.logoIsLoaded = false;
      // console.log(e.message);
    }
  }

  @action
  async uploadLogo(options: any) {
    const data = new FormData();
    data.append('logo', options.file);

    await this.api.post(options.action, data).then((res: any) => {
      options.onSuccess(res.data, options.file);
      this.file = options.file;
    }).catch((err: Error) => {
      console.log(err);
    });
  }
}