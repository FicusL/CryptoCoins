import { action, observable } from 'mobx';
import { AxiosWrapper } from '../../../../Shared/services/AxiosWrapper';
import { LoaderStore } from '../../../../Shared/modules/Loader/store/LoaderStore';
import { inject, injectable } from 'inversify';

@injectable()
export class ResetPasswordChangeStore  {
  protected static readonly GET_TOKEN_DATA_TASK = 'GET_TOKEN_DATA_TASK';

  @observable isLoaded: boolean = false;
  @observable isTokenValid: boolean = true;
  @observable tokenEmail: string = '';
  @observable isPasswordIncorrect = false;
  @observable isSent: boolean = false;

  @inject(AxiosWrapper)
  private readonly axiosWrapper: AxiosWrapper;

  @inject(LoaderStore)
  private readonly loaderStore: LoaderStore;

  @action
  getTokenData(token: string) {
    this.isLoaded = false;
    this.loaderStore.addTask(ResetPasswordChangeStore.GET_TOKEN_DATA_TASK);

    this.axiosWrapper.get('/account/authorization/reset_password/' + token)
      .then(value => {
        this.isLoaded = true;
        this.isTokenValid = true;
        this.tokenEmail = value.toString();
        this.loaderStore.removeTask(ResetPasswordChangeStore.GET_TOKEN_DATA_TASK);
      })
      .catch(reason => {
        this.isLoaded = true;
        this.isTokenValid = false;
        this.loaderStore.removeTask(ResetPasswordChangeStore.GET_TOKEN_DATA_TASK);
      });
  }

  @action
  updatePassword(token: string, password: string) {
    this.axiosWrapper.post('/account/authorization/reset_password/' + token, { password })
      .then(value => {
        this.isSent = true;
      })
      .catch(reason => {
        this.isPasswordIncorrect = true;
        this.isSent = false;
      });
  }

  async loginByResetToken(token: string) {
    try {
      await this.axiosWrapper.post(`/account/authorization/reset_password/${token}/login`);
    } catch (e) {
      // nothing
    }
  }

  @action
  resetPasswordStatus() {
    this.isPasswordIncorrect = false;
  }

  @action
  reset() {
    this.isLoaded = false;
    this.isTokenValid = false;
    this.tokenEmail = '';
    this.isPasswordIncorrect = false;
    this.isSent = false;
  }
}