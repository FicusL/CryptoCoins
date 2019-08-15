import { action, observable } from 'mobx';
import { inject, injectable } from 'inversify';
import { AxiosWrapper } from '../../../../Shared/services/AxiosWrapper';
import { LoaderStore } from '../../../../Shared/modules/Loader/store/LoaderStore';
import { AccountExceptionsCodes } from '../../../../Shared/const/exceptions/AccountExceptionCodes';
import { AxiosResponse } from 'axios';
import { ModalStore } from '../../../../Modals/store/ModalStore';

export interface IResetPasswordRequestPayload {
  email: string;
  captcha: string;
}

@injectable()
export class ResetPasswordRequestStore {
  protected static readonly RESET_PASSWORD_REQUEST_TASK = 'RESET_PASSWORD_REQUEST_TASK';

  @observable isSent: boolean = false;
  @observable isCaptchaIncorrect: boolean = false;
  @observable captchaMustBeReload: boolean = true;
  @observable isEmailNotFound: boolean = false;
  @observable isEmailIncorrect: boolean = false;

  @inject(AxiosWrapper)
  private readonly axiosWrapper: AxiosWrapper;

  @inject(LoaderStore)
  private readonly loaderStore: LoaderStore;

  @inject(ModalStore)
  private readonly modalStore: ModalStore;

  @action
  request(payload: IResetPasswordRequestPayload) {
    this.loaderStore.addTask(ResetPasswordRequestStore.RESET_PASSWORD_REQUEST_TASK);

    this.axiosWrapper.post('/account/authorization/reset_password', payload)
      .then(value => {
        this.isSent = true;
        this.isEmailNotFound = false;
        this.isCaptchaIncorrect = false;

        this.loaderStore.removeTask(ResetPasswordRequestStore.RESET_PASSWORD_REQUEST_TASK);
      })
      .catch((reason: AxiosResponse) => {
        this.isSent = false;

        if (!reason.data || !reason.data.message) {
          return;
        }

        for (const error of reason.data.message) {
          if (error.code === AccountExceptionsCodes.EmailNotFound) {
            this.isEmailNotFound = true;
          }

          if (error.property === 'email') {
            this.isEmailIncorrect = true;
          }

          if (error.property === 'captcha') {
            this.isCaptchaIncorrect = true;
          }

          this.captchaMustBeReload = this.isEmailNotFound || this.isEmailIncorrect || this.isCaptchaIncorrect;
        }

        if (this.isEmailNotFound) {
          this.modalStore.openModal('EMAIL_NOT_FOUND');
        }

        this.loaderStore.removeTask(ResetPasswordRequestStore.RESET_PASSWORD_REQUEST_TASK);
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
    this.isSent = false;
    this.isCaptchaIncorrect = false;
    this.isEmailNotFound = false;
    this.isEmailIncorrect = false;
  }
}
