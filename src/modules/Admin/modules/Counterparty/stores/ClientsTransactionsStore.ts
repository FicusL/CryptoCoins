import { inject, injectable } from 'inversify';
import { AxiosWrapper } from '../../../../Shared/services/AxiosWrapper';
import { action, computed, observable } from 'mobx';
import { IOutClientsTransactionsDTO } from '../dto/IOutClientsTransactionsDTO';
import { LoaderStore } from '../../../../Shared/modules/Loader/store/LoaderStore';
import { ClientsTransactionsModel } from '../model/ClientsTransactionsModel';

export const FETCH_CLIENTS_TRANSACTIONS = 'FETCH_CLIENTS_TRANSACTIONS';

@injectable()
export class ClientsTransactionsStore {
  @inject(AxiosWrapper)
  api: AxiosWrapper;

  @inject(LoaderStore)
  loaderStore: LoaderStore;

  @observable private transactionsMap : Map<number, ClientsTransactionsModel>
    = new Map<number, ClientsTransactionsModel>();

  @computed
  get transactions() {
    return Array.from(this.transactionsMap.values());
  }

  @action
  async fetchTransactions() {
    this.loaderStore.addTask(FETCH_CLIENTS_TRANSACTIONS);

    const clientsTransactionsDTO : IOutClientsTransactionsDTO[] = await this.api.post('/counterparties/transactions');

    clientsTransactionsDTO.forEach(dto => this.transactionsMap.set(dto.transactionId, dto));

    this.loaderStore.removeTask(FETCH_CLIENTS_TRANSACTIONS);
  }
}