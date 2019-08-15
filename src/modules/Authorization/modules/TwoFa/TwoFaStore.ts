import { inject, injectable } from 'inversify';
import { action, observable } from 'mobx';
import { AxiosWrapper } from '../../../Shared/services/AxiosWrapper';
import { LoaderStore } from '../../../Shared/modules/Loader/store/LoaderStore';
import { SessionStore } from '../../../Shared/stores/SessionStore';

@injectable()
export default class TwoFaStore {
  protected static readonly SEND_2FA_CODE_TASK = 'SEND_2FA_CODE_TASK';

  @inject(SessionStore)
  readonly sessionStore: SessionStore;

  @inject(AxiosWrapper)
  readonly axiosWrapper: AxiosWrapper;

  @inject(LoaderStore)
  readonly loaderStore: LoaderStore;

  @observable
  is2FAIncorrect = false;

  @action
  send2FA(code: string) {
    const payload = {code};
    this.loaderStore.addTask(TwoFaStore.SEND_2FA_CODE_TASK);
    this.axiosWrapper.post('/account/authorization/2fa', payload)
      .then(this.onSend2FASuccess)
      .catch(this.onSend2FAError);
  }

  @action.bound
  onSend2FASuccess() {
    this.is2FAIncorrect = false;
    this.loaderStore.removeTask(TwoFaStore.SEND_2FA_CODE_TASK);
    this.sessionStore.refresh();
  }

  @action.bound
  onSend2FAError() {
    this.is2FAIncorrect = true;
    this.loaderStore.removeTask(TwoFaStore.SEND_2FA_CODE_TASK);
  }

  @action
  reset() {
    this.is2FAIncorrect = false;
  }
}