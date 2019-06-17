import { inject, injectable } from 'inversify';
import { AxiosWrapper } from '../../../../services/AxiosWrapper';
import { LoaderStore } from '../../../Loader/store/LoaderStore';
import { action, observable } from 'mobx';
import { BigNumber } from 'bignumber.js';
import { IOutSettingsMinAmountsDTO } from '../../dto/IOutSettingsMinAmountsDTO';

@injectable()
export abstract class BaseMinAmountsStore {
  @inject(AxiosWrapper)
  protected readonly axiosWrapper: AxiosWrapper;

  @inject(LoaderStore)
  protected readonly loaderStore: LoaderStore;

  protected abstract get requestTask(): string;
  protected abstract get requestURL(): string;

  @observable minAmounts = new Map<string, BigNumber>();

  @action
  requestMinAmounts() {
    this.loaderStore.addTask(this.requestTask);

    this.axiosWrapper.get(this.requestURL)
      .then(this.onRequestMinAmountsSuccess)
      .catch(this.onRequestMinAmountsError);
  }

  @action.bound
  onRequestMinAmountsSuccess(result: IOutSettingsMinAmountsDTO) {
    Object.keys(result).forEach((key) => this.minAmounts.set(key, new BigNumber(result[key])));
    this.loaderStore.removeTask(this.requestTask);
  }

  @action.bound
  onRequestMinAmountsError() {
    this.minAmounts.clear();
    this.loaderStore.removeTask(this.requestTask);
  }
}