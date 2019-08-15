import { inject, injectable } from 'inversify';
import { AxiosWrapper } from '../../../../Shared/services/AxiosWrapper';
import { action, computed, observable } from 'mobx';
import { ClientsModel } from '../../Counterparty/model/ClientsModel';
import { IOutClientsDTO } from '../../Counterparty/dto/IOutClientsDTO';
import { LoaderStore } from '../../../../Shared/modules/Loader/store/LoaderStore';

const FETCH_ALL_CLIENTS = 'FETCH_ALL_CLIENTS';

@injectable()
export class AdminClientsStore {
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
  async getAllClients() {
    this.loaderStore.addTask(FETCH_ALL_CLIENTS);

    const clients : IOutClientsDTO[] = await this.api.post('/admin/accounts');

    clients.forEach(client => {
      const clientModal : ClientsModel = {
        key: client.key,
        accountId: client.accountId,
        email: client.email,
        kycStatus: client.kycStatus,
        limitBalance: client.limitBalance,
        transactionsAmount: client.transactionsAmount,
        feesAmount: client.feesAmount,
        date: new Date(client.registrationDate),
        registrationDate: client.registrationDate,
        owner: `${client.firstName} ${client.lastName}`,
      };
      this.clientsMap.set(client.accountId, clientModal);
    });

    this.loaderStore.removeTask(FETCH_ALL_CLIENTS);
  }
}