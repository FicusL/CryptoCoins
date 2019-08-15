import { inject, injectable } from 'inversify';
import { AxiosWrapper } from '../../../../Shared/services/AxiosWrapper';
import { action, computed, observable } from 'mobx';
import { ApiKeysModel } from '../model/ApiKeysModel';
import { IOutApiKeysDTO } from '../dto/IOutApiKeysDTO';
import { LoaderStore } from '../../../../Shared/modules/Loader/store/LoaderStore';

export const FETCH_API_KEYS = 'FETCH_API_KEYS';
export const ADD_API_KEYS = 'ADD_API_KEYS';
export const REMOVE_API_KEYS = 'REMOVE_API_KEYS';

@injectable()
export class ApiKeysStore {
  @inject(AxiosWrapper)
  api: AxiosWrapper;

  @inject(LoaderStore)
  loaderStore: LoaderStore;

  @observable private readonly keysMap : Map<number, ApiKeysModel> = new Map<number, ApiKeysModel>();
  @observable secretKey: string = '';
  @observable publicKey: string = '';

  @computed
  get keys() {
    return Array.from(this.keysMap.values());
  }

  @action
  reset() {
    this.publicKey = '';
    this.secretKey = '';
  }

  @action
  async getApiKeys() {
    this.loaderStore.addTask(FETCH_API_KEYS);

    const apiKeysDto : IOutApiKeysDTO[] = await this.api.get('counterparties/api_keys');

    apiKeysDto.forEach(dto => {
      dto.firstSymbolsOfPublicKey += '...';
      this.keysMap.set(dto.id, dto);
    });

    this.loaderStore.removeTask(FETCH_API_KEYS);
  }

  @action
  async deleteApiKey(id : number) {
    this.loaderStore.addTask(REMOVE_API_KEYS);

    await this.api.delete('counterparties/api_keys/' + id.toString());
    this.keysMap.delete(id);

    this.loaderStore.removeTask(REMOVE_API_KEYS);
  }

  @action
  async addApiKey(payload: string) {
    this.loaderStore.addTask(ADD_API_KEYS);

    const apiKeyDto : IOutApiKeysDTO = await this.api.post('counterparties/api_keys', {
      label: payload,
    });

    apiKeyDto.firstSymbolsOfPublicKey += '...';
    this.publicKey = apiKeyDto.publicKey;
    this.secretKey = apiKeyDto.secretKey;

    this.keysMap.set(apiKeyDto.id, apiKeyDto);

    this.loaderStore.removeTask(ADD_API_KEYS);
  }
}