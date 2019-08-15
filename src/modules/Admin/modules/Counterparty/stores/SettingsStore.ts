import { inject, injectable } from 'inversify';
import { AxiosWrapper } from '../../../../Shared/services/AxiosWrapper';
import { action, observable } from 'mobx';
import { CounterpartyAccountStore } from '../../../../Counterparty/stores/CounterpartyAccountStore';

@injectable()
export class SettingsStore {

  @inject(AxiosWrapper)
  api: AxiosWrapper;

  @inject(CounterpartyAccountStore)
  accountStore: CounterpartyAccountStore;

  @observable counterpartyUrl: string = '';
  @observable counterpartyFooterTextLetter: string = '';

  @action
  async getUrl() {
    try {
      const { url } = await this.api.get(`/counterparties/${this.accountStore.accountId}/url`);
      this.counterpartyUrl = url;
    } catch (e) {
      console.log(e.message);
    }
  }

  @action
  async setUrl(url: string) {
    await this.api.post('/counterparties/url', {url});
    this.counterpartyUrl = url;
  }

  @action
  async getTextLetter() {
    const { letterTextFooter } = await this.api.get('/counterparties/letter_text_footer');
    this.counterpartyFooterTextLetter = letterTextFooter;
  }

  @action
  async setTextLetter(letterTextFooter: string) {
    await this.api.post('/counterparties/letter_text_footer', {letterTextFooter});
    this.counterpartyFooterTextLetter = letterTextFooter;
  }
}