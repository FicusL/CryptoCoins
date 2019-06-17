import { action, computed, observable } from 'mobx';
import { TransactionModel } from '../../../../Shared/modules/Transactions/model/TransactionModel';
import { inject, injectable } from 'inversify';
import { AxiosWrapper } from '../../../../Shared/services/AxiosWrapper';
import { LoaderStore } from '../../../../Shared/modules/Loader/store/LoaderStore';

import { RealtimeBaseStore } from '../../../../Shared/stores/RealtimeBaseStore';
import { IOutTransactionDTO } from '../../../../Shared/modules/Transactions/abstract/dto/IOutTransactionDTO';
import { AxiosResponse } from 'axios';
import { TransactionType } from '../../../../Shared/modules/Transactions/const/TransactionType';
import { IInTransactionWithdrawalUpdateDTO } from '../../Exchange/dto/IInTransactionWithdrawalUpdateDTO';
import { TransactionWithdrawalMethodType } from '../../../../Shared/modules/Transactions/const/TransactionWithdrawalMethodType';

const REQUEST_TRANSACTION_BY_REFERENCE_ID_TASK = 'REQUEST_TRANSACTION_BY_ID_TASK';
const REQUEST_REFERRAL_TRANSACTION_TASK = 'REQUEST_REFERRAL_TRANSACTION_TASK';
const REQUEST_PARTNER_TOTAL_AMOUNT_TASK = 'REQUEST_PARTNER_TOTAL_AMOUNT_TASK';
const LOAD_TRANSACTIONS_TASK = 'LOAD_TRANSACTIONS_TASK';

export enum TransactionGatewayMessage {
  getTransactions = 'get_transactions',
  updateTransaction = 'update_transaction',
  addTransaction = 'add_transaction',
}

export enum TransactionSortBy {
  date = 'date',
  amount = 'amount',
  fee = 'fee',
  rate = 'rate',
  status = 'status',
  currency = 'currency',
  type = 'type',
}

export enum TransactionSortDirection {
  DESC = 'DESC',
  ASC = 'ASC',
}

export enum Tabs {
  Transactions = 'Transactions',
  Referral = 'Referral',
}

export enum TypeFilters {
  ALL = 'ALL',
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  EXCHANGE = 'EXCHANGE',
}

@injectable()
export class TransactionsStore extends RealtimeBaseStore {
  protected static readonly WITHDRAWAL_UPDATE_TASK = 'WITHDRAWAL_UPDATE_TASK';

  @inject(AxiosWrapper)
  private readonly axiosWrapper: AxiosWrapper;

  @inject(LoaderStore)
  private readonly UIStore: LoaderStore;

  @observable readonly referenceIdToTransaction = new Map<string, TransactionModel>();
  @observable _referralTransactions = [];

  @observable sortBy: TransactionSortBy = TransactionSortBy.date;
  @observable sortDirection: TransactionSortDirection = TransactionSortDirection.DESC;

  @observable typeFilter: TypeFilters = TypeFilters.ALL;
  @observable sumFilterMin?: number;
  @observable sumFilterMax?: number;
  @observable currencyFilter?: string;
  @observable dateFilterMin?: Date;
  @observable dateFilterMax?: Date;

  @observable currentTab: Tabs = Tabs.Transactions;
  @observable partnerTotalAmount = [];

  @computed
  get transactions(): TransactionModel[] {
    return Array.from(this.referenceIdToTransaction.values());
  }

  @computed
  get referralTransactions() {
    return this._referralTransactions;
  }

  @computed
  get depositTransactions(): TransactionModel[] {
    return this.transactions.filter(transaction => transaction.type === TransactionType.Deposit);
  }

  @computed
  get exchangeTransactions(): TransactionModel[] {
    return this.transactions.filter(transaction =>
      [TransactionType.Exchange, TransactionType.ExchangeWithdrawal].indexOf(transaction.type) !== -1);
  }

  @computed
  get withdrawTransactions(): TransactionModel[] {
    return this.transactions.filter(transaction =>
      [TransactionType.Withdrawal, TransactionType.ExchangeWithdrawal].indexOf(transaction.type) !== -1);
  }

  @computed
  get filteredTransactions(): TransactionModel[] {
    let filteredByType: TransactionModel[] = [];
    switch (this.typeFilter) {
      case TypeFilters.ALL: filteredByType = this.transactions; break;
      case TypeFilters.DEPOSIT: filteredByType = this.depositTransactions; break;
      case TypeFilters.EXCHANGE: filteredByType = this.exchangeTransactions; break;
      case TypeFilters.WITHDRAW: filteredByType = this.withdrawTransactions; break;
    }

    return filteredByType.filter(transaction => {
      return  (this.sumFilterMin ? Number(transaction.amount) >= this.sumFilterMin : true)
        && (this.sumFilterMax ? Number(transaction.amount) <= this.sumFilterMax : true)
        && (this.dateFilterMin ? transaction.date >= this.dateFilterMin : true)
        && (this.dateFilterMax ? transaction.date <= this.dateFilterMax : true)
        && (this.currencyFilter
          ? (!this.currencyFilter || this.currencyFilter === transaction.currency)
          : true);
    });
  }

  @computed
  get lastTransactions(): TransactionModel[] {
    return this.sortedByDate.slice(0, 5);
  }

  @computed
  get lastExchangeTransactions(): TransactionModel[] {
    return this.exchangeTransactionsSortedByDate.slice(0, 5);
  }

  @computed
  get sortedByDate() {
    const comparer = (a: TransactionModel, b: TransactionModel) => a.date.getTime() - b.date.getTime();
    return this.sortDirection === TransactionSortDirection.ASC
      ? this.filteredTransactions.sort((a, b) => comparer(a, b))
      : this.filteredTransactions.sort((b, a) => comparer(a, b));
  }

  @computed
  get exchangeTransactionsSortedByDate() {
    const comparer = (a: TransactionModel, b: TransactionModel) => a.date.getTime() - b.date.getTime();
    return this.sortDirection === TransactionSortDirection.ASC
      ? this.exchangeTransactions.sort((a, b) => comparer(a, b))
      : this.exchangeTransactions.sort((b, a) => comparer(a, b));
  }

  @computed
  get sortedByStatus() {
    const comparer = (a: TransactionModel, b: TransactionModel) => a.status.localeCompare(b.status);
    return this.sortDirection === TransactionSortDirection.ASC
      ? this.filteredTransactions.sort((a, b) => comparer(a, b))
      : this.filteredTransactions.sort((b, a) => comparer(a, b));
  }

  @computed
  get sortedByRate() {
    // TODO: Fix it
    return this.filteredTransactions;
    // const comparer = (a: TransactionModel, b: TransactionModel) => a.rateCoefficient
    // .localeCompare(b.rateCoefficient);
    // return this.sortDirection === TransactionSortDirection.ASC
    //   ? this.filteredTransactions.sort((a, b) => comparer(a, b))
    //   : this.filteredTransactions.sort((b, a) => comparer(a, b));
  }

  @computed
  get sortedByFee() {
    const comparer = (a: TransactionModel, b: TransactionModel) => a.feeString.localeCompare(b.feeString);
    return this.sortDirection === TransactionSortDirection.ASC
      ? this.filteredTransactions.sort((a, b) => comparer(a, b))
      : this.filteredTransactions.sort((b, a) => comparer(a, b));
  }

  @computed
  get sortedByAmount() {
    const comparer = (a: TransactionModel, b: TransactionModel) =>
      a.amount.toString().localeCompare(b.amount.toString());

    return this.sortDirection === TransactionSortDirection.ASC
      ? this.filteredTransactions.sort((a, b) => comparer(a, b))
      : this.filteredTransactions.sort((b, a) => comparer(a, b));
  }

  @computed
  get sortedByCurrency() {
    const comparer = (a: TransactionModel, b: TransactionModel) => a.currency.localeCompare(b.currency);
    return this.sortDirection === TransactionSortDirection.ASC
      ? this.filteredTransactions.sort((a, b) => comparer(a, b))
      : this.filteredTransactions.sort((b, a) => comparer(a, b));
  }

  @computed
  get sortedByType() {
    const comparer = (a: TransactionModel, b: TransactionModel) => a.type.localeCompare(b.type);
    return this.sortDirection === TransactionSortDirection.ASC
      ? this.filteredTransactions.sort((a, b) => comparer(a, b))
      : this.filteredTransactions.sort((b, a) => comparer(a, b));
  }

  @computed
  get sortedTransactions(): TransactionModel[] {
    switch (this.sortBy) {
      case TransactionSortBy.date: return this.sortedByDate;
      case TransactionSortBy.status: return this.sortedByStatus;
      case TransactionSortBy.rate: return this.sortedByRate;
      case TransactionSortBy.fee: return this.sortedByFee;
      case TransactionSortBy.amount: return this.sortedByAmount;
      case TransactionSortBy.type: return this.sortedByType;
      case TransactionSortBy.currency: return this.sortedByCurrency;
    }

    return [];
  }

  constructor() {
    super();

    this.resetSort();

    this.socket.on('connect', () => {
      console.log('Transaction store socket connected');
    });

    this.socket.on(TransactionGatewayMessage.getTransactions, async (result) => {
      const transactionsDTO = result.transactions as IOutTransactionDTO[];
      const transactions = await Promise.all(transactionsDTO.map((dto) => TransactionModel.create(dto)));
      transactions.map(transaction => this.pushTransaction(transaction as TransactionModel));
      this.UIStore.removeTask(LOAD_TRANSACTIONS_TASK);
    });

    this.socket.on(TransactionGatewayMessage.updateTransaction, async (transactionDTO: IOutTransactionDTO) => {
      this.pushTransaction(await TransactionModel.create(transactionDTO));
    });

    this.socket.on(TransactionGatewayMessage.addTransaction, async (transactionDTO: IOutTransactionDTO) => {
      this.pushTransaction(await TransactionModel.create(transactionDTO));
    });
  }

  @action
  async getTransactionByReferenceId(referenceId: string): Promise<TransactionModel | undefined> {

    return new Promise<TransactionModel | undefined>(resolve => {
      this.UIStore.addTask(REQUEST_TRANSACTION_BY_REFERENCE_ID_TASK);

      this.axiosWrapper.post('/transactions/find_one', { referenceId }).then(
        action(async (result: IOutTransactionDTO) => {
          const transaction = await TransactionModel.create(result);
          this.pushTransaction(transaction);

          this.UIStore.removeTask(REQUEST_TRANSACTION_BY_REFERENCE_ID_TASK);
          resolve(transaction);
        }),

        action((reason: AxiosResponse) => {
          this.UIStore.removeTask(REQUEST_TRANSACTION_BY_REFERENCE_ID_TASK);
          resolve(undefined);
        }),
      );
    });
  }

  @action
  async getReferralTransactions() {
      this.UIStore.addTask(REQUEST_REFERRAL_TRANSACTION_TASK);

      try {
        this._referralTransactions = await this.axiosWrapper.get('/transactions/referral');
      } catch (err) {
        console.log(err);
      }

      this.UIStore.removeTask(REQUEST_REFERRAL_TRANSACTION_TASK);
  }

  @action
  async getPartnerTotalAmount() {
    this.UIStore.addTask(REQUEST_PARTNER_TOTAL_AMOUNT_TASK);

    try {
      this.partnerTotalAmount = await this.axiosWrapper.get('/transactions/referral_balance');
    } catch (err) {
      console.log(err);
    }

    this.UIStore.removeTask(REQUEST_PARTNER_TOTAL_AMOUNT_TASK);
  }

  loadTransactions = () => {
    if (this.UIStore.hasTask(LOAD_TRANSACTIONS_TASK)) {
      return;
    }

    // this.UIStore.addTask(LOAD_TRANSACTIONS_TASK); // TODO: Add LOAD_TRANSACTIONS_TASK
    const payload = { sort: { by: TransactionSortBy.date, order: this.sortDirection }};
    this.socket.emit(TransactionGatewayMessage.getTransactions, payload);
  };

  @action
  onSort(sortBy: TransactionSortBy) {
    if (this.sortBy === sortBy) {
      this.sortDirection = this.sortDirection === TransactionSortDirection.DESC
        ? TransactionSortDirection.ASC
        : TransactionSortDirection.DESC;
    } else {
      this.sortBy = sortBy;
      this.sortDirection = this.sortBy === TransactionSortBy.date
        ? TransactionSortDirection.DESC
        : TransactionSortDirection.ASC;
    }
  }

  @action
  pushTransaction(transaction: TransactionModel) {
    this.referenceIdToTransaction.set(transaction.referenceId, transaction);
  }

  @action
  resetSort() {
    this.sortBy = TransactionSortBy.date;
    this.sortDirection = TransactionSortDirection.DESC;
  }

  @action
  async updateWithdrawalMethod(transaction: TransactionModel,
                               methodType: TransactionWithdrawalMethodType,
                               methodId: number,
                               code: string,
  ) {
    const payload: IInTransactionWithdrawalUpdateDTO = { methodId, methodType, code };
    return new Promise((resolve, reject) => {
      this.UIStore.addTask(TransactionsStore.WITHDRAWAL_UPDATE_TASK);

      return this.axiosWrapper.put(`/transactions/${transaction.referenceId}/withdrawal`, payload)
        .then(this.onUpdateWithdrawalMethodSuccess).then(() => resolve())
        .catch(this.onUpdateWithdrawalMethodError).catch((r) => reject(r));
    });
  }

  @action.bound
  async onUpdateWithdrawalMethodSuccess(transactionDTO: IOutTransactionDTO) {
    this.pushTransaction(await TransactionModel.create(transactionDTO));
    this.UIStore.removeTask(TransactionsStore.WITHDRAWAL_UPDATE_TASK);
    return transactionDTO;
  }

  @action.bound
  onUpdateWithdrawalMethodError(response: AxiosResponse) {
    this.UIStore.removeTask(TransactionsStore.WITHDRAWAL_UPDATE_TASK);
    throw response;
  }

  @action
  switchTab() {
    this.currentTab = this.currentTab === Tabs.Transactions ? Tabs.Referral : Tabs.Transactions;
  }
}