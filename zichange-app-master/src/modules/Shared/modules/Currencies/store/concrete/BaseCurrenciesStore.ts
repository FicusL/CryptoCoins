import { inject, injectable } from 'inversify';
import { action, observable } from 'mobx';
import { LoaderStore } from '../../../Loader/store/LoaderStore';
import { AxiosWrapper } from '../../../../services/AxiosWrapper';

@injectable()
export abstract class BaseCurrenciesStore {
  @inject(LoaderStore)
  protected readonly loaderStore: LoaderStore;

  @inject(AxiosWrapper)
  protected readonly axiosWrapper: AxiosWrapper;

  protected abstract get requestTask(): string;
  protected abstract get requestURL(): string;

  @observable currencies: string[] = [];

  @action
  requestCurrencies() {
    this.loaderStore.addTask(this.requestTask);

    this.axiosWrapper.get(this.requestURL)
      .then(this.onRequestCurrenciesSuccess)
      .catch(this.onRequestCurrenciesError);
  }

  @action.bound
  onRequestCurrenciesSuccess(result: { currencies: string[] }) {
    this.currencies = result.currencies;
    this.loaderStore.removeTask(this.requestTask);
  }

  @action.bound
  onRequestCurrenciesError() {
    this.currencies = [];
    this.loaderStore.removeTask(this.requestTask);
  }
}