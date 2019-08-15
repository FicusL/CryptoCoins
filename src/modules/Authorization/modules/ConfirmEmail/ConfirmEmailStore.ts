import { action, observable } from 'mobx';
import { inject, injectable } from 'inversify';
import { LoaderStore } from '../../../Shared/modules/Loader/store/LoaderStore';
import { AxiosWrapper } from '../../../Shared/services/AxiosWrapper';
import { AxiosResponse } from 'axios';

@injectable()
export class ConfirmEmailStore {
  protected static readonly RESEND_CONFIRMATION_TASK = 'RESEND_CONFIRMATION_TASK';

  @inject(AxiosWrapper)
  private readonly axiosWrapper: AxiosWrapper;

  @inject(LoaderStore)
  private readonly loaderStore: LoaderStore;

  @observable isCaptchaIncorrect = false;
  @observable isSent = false;

  @action
  resendConfirmation(captcha: string) {
    this.loaderStore.addTask(ConfirmEmailStore.RESEND_CONFIRMATION_TASK);

    this.axiosWrapper.post('/account/authorization/register/resend_activation', { captcha })
      .then(value => {
        this.loaderStore.removeTask(ConfirmEmailStore.RESEND_CONFIRMATION_TASK);
        this.isSent = true;
      })
      .catch((reason: AxiosResponse) => {
        for (const error of reason.data.message) {
          this.isCaptchaIncorrect =  this.isCaptchaIncorrect || error.property === 'captcha';
        }

        this.loaderStore.removeTask(ConfirmEmailStore.RESEND_CONFIRMATION_TASK);
      });
  }

  @action
  reset() {
    this.isCaptchaIncorrect = false;
    this.isSent = false;
  }

}