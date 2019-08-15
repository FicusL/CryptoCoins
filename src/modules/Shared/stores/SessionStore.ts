import { action, computed, observable } from 'mobx';
import { AxiosWrapper } from '../services/AxiosWrapper';
import { LoaderStore } from '../modules/Loader/store/LoaderStore';
import { inject, injectable } from 'inversify';

@injectable()
export class SessionStore {
  static readonly FETCH_SESSION_DATA_TASK = 'FETCH_SESSION_DATA_TASK';
  static readonly LOGOUT_TASK = 'LOGOUT_TASK';

  @observable accountId: -1;
  @observable isLoggedIn = false;
  @observable isActivated = false;
  @observable isAuthorized = false;
  @observable isTrader = false;
  @observable isAmlOfficer = false;
  @observable isAdmin = false;
  @observable isLoaded = false;
  @observable isCounterparty = false;

  @computed
  get canAccessDashboard() {
    return this.isLoggedIn && this.isActivated && this.isAuthorized;
  }

  @computed
  get isWaitingActivation() {
    return this.isLoggedIn && this.isAuthorized && !this.isActivated;
  }

  @computed
  get isWaiting2FA() {
    return this.isLoggedIn && this.isActivated && !this.isAuthorized;
  }

  @computed
  get canAccessAdmin() {
    return this.canAccessDashboard && (this.isAdmin || this.isTrader || this.isAmlOfficer || this.isCounterparty);
  }

  @inject(AxiosWrapper)
  private readonly axiosWrapper: AxiosWrapper;

  @inject(LoaderStore)
  private readonly loaderStore: LoaderStore;

  @action
  refresh(ignoreLoader: boolean = false) {
    if (!ignoreLoader) {
      this.isLoaded = false;
      this.loaderStore.addTask(SessionStore.FETCH_SESSION_DATA_TASK);
    }

    this.axiosWrapper.get('/account/authorization/session')
      .then(this.onRefreshSuccess)
      .catch(this.onRefreshError);
  }

  @action.bound
  onRefreshSuccess(value: any) {
    Object.assign(this, value);
    this.isLoaded = true;
    this.loaderStore.removeTask(SessionStore.FETCH_SESSION_DATA_TASK);
  }

  @action.bound
  onRefreshError() {
    this.reset();
    this.isLoaded = true;
    this.loaderStore.removeTask(SessionStore.FETCH_SESSION_DATA_TASK);
  }

  @action
  reset() {
    this.accountId = -1;

    this.isLoggedIn = false;
    this.isActivated = false;
    this.isAuthorized = false;
    this.isAdmin = false;
    this.isTrader = false;
    this.isAmlOfficer = false;
    this.isCounterparty = false;
  }

  @action
  logout() {
    this.loaderStore.addTask(SessionStore.LOGOUT_TASK);

    this.axiosWrapper.post('/account/authorization/logout')
      .then(this.onLogoutSuccess)
      .catch(this.onLogoutError);
  }

  @action.bound
  onLogoutSuccess() {
    this.reset();
    this.loaderStore.removeTask(SessionStore.LOGOUT_TASK);
  }

  @action.bound
  onLogoutError() {
    this.reset();
    this.loaderStore.removeTask(SessionStore.LOGOUT_TASK);
  }
}
