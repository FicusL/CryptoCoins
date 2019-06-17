import { action, observable } from 'mobx';
import { AxiosWrapper } from '../../../Shared/services/AxiosWrapper';
import { LoaderStore } from '../../../Shared/modules/Loader/store/LoaderStore';
import { SessionStore } from '../../../Shared/stores/SessionStore';
import { inject, injectable } from 'inversify';

@injectable()
export class VerifyEmailStore {
  protected static readonly SEND_EMAIL_VERIFICATION_TASK = 'SEND_EMAIL_VERIFICATION_TASK';

  @inject(AxiosWrapper)
  private readonly axiosWrapper: AxiosWrapper;

  @inject(LoaderStore)
  private readonly loaderStore: LoaderStore;

  @inject(SessionStore)
  private readonly sessionStore: SessionStore;

  @observable isTokenValid = false;

  @action
  verify(token: string) {
    this.loaderStore.addTask(VerifyEmailStore.SEND_EMAIL_VERIFICATION_TASK);

    this.axiosWrapper.post('/account/authorization/register/activate/' + token)
      .then(value => {
        this.isTokenValid = true;
        this.loaderStore.removeTask(VerifyEmailStore.SEND_EMAIL_VERIFICATION_TASK);
      })
      .catch(reason => {
        this.isTokenValid = false;
        this.loaderStore.removeTask(VerifyEmailStore.SEND_EMAIL_VERIFICATION_TASK);
      });
  }

  @action
  reset() {
    this.isTokenValid = false;
    this.sessionStore.refresh();
  }
}