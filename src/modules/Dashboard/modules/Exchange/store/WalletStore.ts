import { inject, injectable } from 'inversify';
import { LoaderStore } from '../../../../Shared/modules/Loader/store/LoaderStore';
import { FacadeCurrenciesStore } from '../../../../Shared/modules/Currencies/store/FacadeCurrenciesStore';
import { TransactionsStore } from '../../Transactions/stores/TransactionsStore';
import { action, computed, observable } from 'mobx';
import { BigNumber } from 'bignumber.js';
import { AxiosWrapper } from '../../../../Shared/services/AxiosWrapper';
import { SessionStore } from '../../../../Shared/stores/SessionStore';

@injectable()
export class WalletStore {
  private static readonly FETCH_BALANCES_TASK = 'FETCH_BALANCES_TASK';

  @inject(SessionStore)
  sessionStore: SessionStore;

  @inject(LoaderStore)
  loaderStore: LoaderStore;

  @inject(FacadeCurrenciesStore)
  facadeCurrenciesStore: FacadeCurrenciesStore;

  @inject(TransactionsStore)
  transactionsStore: TransactionsStore;

  @inject(AxiosWrapper)
  axiosWrapper: AxiosWrapper;

  @observable protected balancesRaw = new Map<string, BigNumber>();

  @computed
  get fiatBalances() {
    const result = new Map();

    const { fiatCurrencies } = this.facadeCurrenciesStore;
    fiatCurrencies.forEach(value => result.set(value, new BigNumber(0)));
    this.balancesRaw.forEach((value, key) => {
      if (fiatCurrencies.indexOf(key) !== -1) {
        result.set(key, value);
      }
    });

    return result;
  }

  @computed
  get cryptoBalances() {
    const result = new Map();

    const { cryptoCurrencies } = this.facadeCurrenciesStore;
    cryptoCurrencies.forEach(value => result.set(value, new BigNumber(0)));
    this.balancesRaw.forEach((value, key) => {
      if (cryptoCurrencies.indexOf(key) !== -1) {
        result.set(key, value);
      }
    });

    return result;
  }

  @action
  fetchBalances() {
    const { balancesRaw } = this;

    balancesRaw.forEach((value, key) => balancesRaw.set(key, new BigNumber(0)));
    this.loaderStore.addTask(WalletStore.FETCH_BALANCES_TASK);

    this.axiosWrapper.get(`/accounts/${this.sessionStore.accountId}/balances`)
      .then(this.onFetchBalancesSuccess)
      .catch(this.onFetchBalancesError);
  }

  @action.bound
  onFetchBalancesSuccess(balances) {
    balances.forEach((item) => this.balancesRaw.set(item.currency, new BigNumber(item.balance)));
    this.loaderStore.removeTask(WalletStore.FETCH_BALANCES_TASK);
  }

  @action.bound
  onFetchBalancesError() {
    this.loaderStore.removeTask(WalletStore.FETCH_BALANCES_TASK);
  }
}