import { action, observable } from 'mobx';
import { inject, injectable } from 'inversify';
import { AxiosWrapper } from '../../../../Shared/services/AxiosWrapper';
import { CounterpartyAccountStore } from '../../../stores/CounterpartyAccountStore';
import { LoaderStore } from '../../../../Shared/modules/Loader/store/LoaderStore';

const REQUEST_CAPTCHA = 'REQUEST_CAPTCHA';

@injectable()
export class ActiveAccountStore {
  @inject(AxiosWrapper)
  private readonly api: AxiosWrapper;

  @inject(CounterpartyAccountStore)
  private readonly accountStore: CounterpartyAccountStore;

  @inject(LoaderStore)
  private readonly loaderStore: LoaderStore;

  @observable isReSendCode: boolean = false;
  @observable isCaptchaIncorrect : boolean = false;
  @observable isCodeIncorrect: boolean = false;
  @observable captchaMustBeReload: boolean = true;
  @observable codeError: string = '';

  @action
  flushCaptcha() {
    this.captchaMustBeReload = false;
  }

  @action
  resetCaptcha() {
    this.captchaMustBeReload = true;
  }

  @action
  reset() {
    this.isCaptchaIncorrect = false;
    this.isCodeIncorrect = false;
    this.isReSendCode = false;
    this.codeError = '';
  }

  @action
  async activateAccount(code : string) {
    await this.api.post(`/account/counterparties/${this.accountStore.token}/activate`, { code })
      .catch((reason) => {
        for (const error of reason.data.message) {
          this.isCodeIncorrect = this.isCodeIncorrect || error.property === 'code';
          this.codeError = error.description;
        }
      });
  }

  @action
  async resendCode(captcha: string) {
    this.loaderStore.addTask(REQUEST_CAPTCHA);

    await this.api.post(`/account/counterparties/${this.accountStore.token}/resend_code`, { captcha })
      .then(() => {
          this.isReSendCode = false;
      })
      .catch((reason) => {
        for (const error of reason.data.message) {
          this.isCaptchaIncorrect = this.isCaptchaIncorrect || error.property === 'captcha';
          this.isReSendCode = true;
        }
      });

    this.loaderStore.removeTask(REQUEST_CAPTCHA);
  }
}
