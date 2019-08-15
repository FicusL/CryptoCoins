import { action, observable } from 'mobx';
import { inject, injectable } from 'inversify';
import { LoaderStore } from '../../../Shared/modules/Loader/store/LoaderStore';
import { AxiosWrapper } from '../../../Shared/services/AxiosWrapper';
import { SessionStore } from '../../../Shared/stores/SessionStore';
import { AccountExceptionsCodes } from '../../../Shared/const/exceptions/AccountExceptionCodes';
import { AxiosResponse } from 'axios';
import { ModalStore } from '../../../Modals/store/ModalStore';

export interface ILoginPayload {
  email: string;
  password: string;
  captcha: string;
}

@injectable()
export class LoginStore {
  protected static readonly LOGIN_ATTEMPT_TASK = 'LOGIN_ATTEMPT_TASK';

  @inject(AxiosWrapper)
  private readonly axiosWrapper: AxiosWrapper;

  @inject(LoaderStore)
  private readonly loaderStore: LoaderStore;

  @inject(SessionStore)
  private readonly sessionStore: SessionStore;

  @inject(ModalStore)
  private readonly modalStore: ModalStore;

  @observable isCaptchaIncorrect = false;
  @observable isEmailIncorrect = false;
  @observable isPasswordIncorrect = false;
  @observable captchaMustBeReload = true;

  @action
  loginAttempt(payload: ILoginPayload) {
    this.loaderStore.addTask(LoginStore.LOGIN_ATTEMPT_TASK);

    this.axiosWrapper.post('/account/authorization/login', payload)
      .then(value => {
        this.loaderStore.removeTask(LoginStore.LOGIN_ATTEMPT_TASK);
        setTimeout(() => {
          const that = this;
          that.sessionStore.logout();
          that.modalStore.openModal('SESSION_EXPIRED');
        }, 1000 * 60 * 60);
        this.sessionStore.refresh();
      })
      .catch((reason: AxiosResponse) => {
        for (const error of reason.data.message) {
          this.isEmailIncorrect = this.isEmailIncorrect || (error.property === 'email'
            && error.code !== AccountExceptionsCodes.NoEmailPasswordMatches);

          this.isPasswordIncorrect = this.isPasswordIncorrect || error.property === 'password';
          this.isCaptchaIncorrect = this.isCaptchaIncorrect || error.property === 'captcha';
        }

        this.captchaMustBeReload = this.isPasswordIncorrect || this.isEmailIncorrect || this.isCaptchaIncorrect;

        this.loaderStore.removeTask(LoginStore.LOGIN_ATTEMPT_TASK);
      });
  }

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
    this.isEmailIncorrect = false;
    this.isPasswordIncorrect = false;

    this.loaderStore.removeTask(LoginStore.LOGIN_ATTEMPT_TASK);
  }
}
