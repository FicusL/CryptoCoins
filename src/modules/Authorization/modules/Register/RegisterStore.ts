import { action, computed, observable } from 'mobx';
import { inject, injectable } from 'inversify';
import { AxiosWrapper } from '../../../Shared/services/AxiosWrapper';
import { LoaderStore } from '../../../Shared/modules/Loader/store/LoaderStore';
import { SessionStore } from '../../../Shared/stores/SessionStore';
import { AccountExceptionsCodes } from '../../../Shared/const/exceptions/AccountExceptionCodes';
import { AxiosResponse } from 'axios';

export interface IRegisterPayload {
  email: string;
  password: string;
  captcha: string;
  type: string;
  invite_code?: string;
  referralToken?: string;
}

@injectable()
export class RegisterStore {
  protected static readonly REGISTER_ATTEMPT_TASK = 'REGISTER_ATTEMPT_TASK';

  @inject(AxiosWrapper)
  private readonly axiosWrapper: AxiosWrapper;

  @inject(LoaderStore)
  private readonly loaderStore: LoaderStore;

  @inject(SessionStore)
  private readonly sessionStore: SessionStore;

  @observable isCaptchaIncorrect = false;
  @observable isEmailIncorrect = false;
  @observable isEmailAlreadyRegistered = false;
  @observable isPasswordIncorrect = false;
  @observable isInviteCodeIncorrect = false;
  @observable isReferralIncorrect = false;
  @observable captchaMustBeReload = true;

  @computed
  get hasError() {
    return this.isCaptchaIncorrect || this.isEmailIncorrect || this.isEmailAlreadyRegistered
      || this.isPasswordIncorrect || this.isInviteCodeIncorrect;
  }

  @action
  registerAttempt(payload: IRegisterPayload)
  {
    this.loaderStore.addTask(RegisterStore.REGISTER_ATTEMPT_TASK);

    return new Promise((resolve, reject) => {
      this.axiosWrapper.post('/account/authorization/register', payload)
        .then(() => {
          this.loaderStore.removeTask(RegisterStore.REGISTER_ATTEMPT_TASK);
          this.sessionStore.refresh();
        })
        .catch((reason: AxiosResponse) => {
          const message = reason.data.message;

          for (const error of message) {
            if (error.property === 'email') {
              if (error.code === AccountExceptionsCodes.EmailAlreadyRegistered) {
                this.isEmailAlreadyRegistered = true;
              } else {
                this.isEmailIncorrect = true;
              }
            }

            if (error.property === 'password') { this.isPasswordIncorrect = true; }
            if (error.property === 'captcha') { this.isCaptchaIncorrect = true; }
            if (error.property === 'invite_code') { this.isInviteCodeIncorrect = true; }
            if (error.property === 'referralToken') { this.isReferralIncorrect = true; }
          }

          this.captchaMustBeReload =
            this.isCaptchaIncorrect ||
            this.isEmailIncorrect ||
            this.isEmailAlreadyRegistered ||
            this.isPasswordIncorrect ||
            this.isInviteCodeIncorrect ||
            this.isReferralIncorrect;

          reject();
          this.loaderStore.removeTask(RegisterStore.REGISTER_ATTEMPT_TASK);
        });
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
    this.isEmailAlreadyRegistered = false;
    this.isPasswordIncorrect = false;
    this.isInviteCodeIncorrect = false;
    this.isReferralIncorrect = false;

    this.loaderStore.removeTask(RegisterStore.REGISTER_ATTEMPT_TASK);
  }
}