import { inject, injectable } from 'inversify';
import { AxiosWrapper } from '../../../../Shared/services/AxiosWrapper';
import { action, computed, observable } from 'mobx';
import { WhiteListIpModel } from '../model/WhiteListIpModel';
import { LoaderStore } from '../../../../Shared/modules/Loader/store/LoaderStore';

export const FETCH_WHITE_LIST = 'FETCH_WHITE_LIST';
export const ADD_IP_ADDRESS = 'ADD_IP_ADDRESS';
export const REMOVE_IP_ADDRESS = 'REMOVE_IP_ADDRESS';

@injectable()
export class WhiteListIpStore {
  @inject(AxiosWrapper)
  api: AxiosWrapper;

  @inject(LoaderStore)
  loaderStore: LoaderStore;

  @observable whiteListMap: Map<string, WhiteListIpModel> = new Map<string, WhiteListIpModel>();
  @observable useWhiteListIPs: boolean = false;

  @computed
  get whiteList() {
    return Array.from(this.whiteListMap.values());
  }

  @action
  async onWhiteList() {
    await this.api.post('counterparties/white_list_ip');
  }

  @action
  async offWhiteList() {
    await this.api.delete('counterparties/white_list_ip');
  }

  @action
  async addIpAddress(ipAddress: string) {
    this.loaderStore.addTask(ADD_IP_ADDRESS);

    await this.api.post(`/counterparties/white_list_ip/${ipAddress}`);

    this.whiteListMap.set(ipAddress, new WhiteListIpModel(ipAddress));

    this.loaderStore.removeTask(REMOVE_IP_ADDRESS);
  }

  @action
  async deleteIpAddress(ipAddress: string) {
    this.loaderStore.addTask(REMOVE_IP_ADDRESS);

    await this.api.delete(`/counterparties/white_list_ip/${ipAddress}`);

    this.whiteListMap.delete(ipAddress);

    this.loaderStore.removeTask(REMOVE_IP_ADDRESS);
  }

  @action
  async getWhiteListIpAddresses() {
    this.loaderStore.addTask(FETCH_WHITE_LIST);

    const response = await this.api.get('/counterparties/white_list_ip');

    response.whiteListIPs.forEach(ipAddress => this.whiteListMap.set(ipAddress, new WhiteListIpModel(ipAddress)));
    this.useWhiteListIPs = response.useWhiteListIPs;

    this.loaderStore.removeTask(FETCH_WHITE_LIST);
  }
}