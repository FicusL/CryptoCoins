import { action, observable } from 'mobx';
import { inject, injectable } from 'inversify';
import { AxiosWrapper } from '../../../Shared/services/AxiosWrapper';
import { LoaderStore } from '../../../Shared/modules/Loader/store/LoaderStore';

@injectable()
export class InviteCodesStore {
  private static readonly FETCH_INVITE_CODES_STATUS_TASK = 'FETCH_INVITE_CODES_STATUS_TASK';

  @inject(AxiosWrapper)
  private readonly axiosWrapper: AxiosWrapper;

  @inject(LoaderStore)
  private readonly loaderStore: LoaderStore;

  @observable isEnabled = false;

  @action
  fetchInviteCodesStatus() {
    this.loaderStore.addTask(InviteCodesStore.FETCH_INVITE_CODES_STATUS_TASK);

    this.axiosWrapper.get('/accounts/invite_codes/is_enabled')
      .then(this.fetchInviteCodesStatusSuccess)
      .catch(this.fetchInviteCodesStatusError);
  }

  @action.bound
  protected fetchInviteCodesStatusSuccess(isEnabled: boolean) {
    this.loaderStore.removeTask(InviteCodesStore.FETCH_INVITE_CODES_STATUS_TASK);
    this.isEnabled = isEnabled;
  }

  @action.bound
  protected fetchInviteCodesStatusError() {
    this.loaderStore.removeTask(InviteCodesStore.FETCH_INVITE_CODES_STATUS_TASK);
    this.isEnabled = false;
  }
}