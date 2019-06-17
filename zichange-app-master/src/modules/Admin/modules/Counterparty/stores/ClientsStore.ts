import { injectable, inject } from 'inversify';
import { AxiosWrapper } from '../../../../Shared/services/AxiosWrapper';
import { action, computed, observable } from 'mobx';
import { IOutClientsDTO } from '../dto/IOutClientsDTO';
import { ClientsModel } from '../model/ClientsModel';
import { LoaderStore } from '../../../../Shared/modules/Loader/store/LoaderStore';

export const FETCH_CLIENTS = 'FETCH_CLIENTS';

@injectable()
export class ClientsStore {
  @inject(AxiosWrapper)
  api: AxiosWrapper;

  @inject(LoaderStore)
  loaderStore: LoaderStore;

  @observable private clientsMap : Map<number, ClientsModel> = new Map<number, ClientsModel>();

  @computed
  get clients() {
    return Array.from(this.clientsMap.values());
  }

  @action
  async getClients() {
    this.loaderStore.addTask(FETCH_CLIENTS);

    const clients : IOutClientsDTO[] = await this.api.post('/counterparties/accounts');

    clients.forEach(client => {
      const clientModal : ClientsModel = {
        key: client.key,
        accountId: client.accountId,
        email: client.email,
        kycStatus: client.kycStatus,
        limitBalance: client.limitBalance,
        transactionsAmount: client.transactionsAmount,
        feesAmount: client.feesAmount,
        date: new Date(),
        owner: `${client.firstName} ${client.lastName}`,
      };
      this.clientsMap.set(client.accountId, clientModal);
    });

    this.loaderStore.removeTask(FETCH_CLIENTS);
  }
}