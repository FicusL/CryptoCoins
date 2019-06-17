import { inject, injectable } from 'inversify';
import { RealtimeBaseStore } from '../../../../Shared/stores/RealtimeBaseStore';
import { action, computed, observable, runInAction } from 'mobx';
import { AxiosWrapper } from '../../../../Shared/services/AxiosWrapper';
import { TransactionModel } from '../../../../Shared/modules/Transactions/model/TransactionModel';
import { TransactionStatus } from '../../../../Shared/modules/Transactions/const/TransactionStatus';
import { TransactionsSocketMessages } from '../const/TransactionsSocketMessages';
import { IInTransactionsFiltersDTO } from '../dto/IInTransactionsFiltersDTO';
import { notification } from 'antd';
import { IOutTransactionDTO } from '../../../../Shared/modules/Transactions/abstract/dto/IOutTransactionDTO';
import { TransactionType } from '../../../../Shared/modules/Transactions/const/TransactionType';
import { LoaderStore } from '../../../../Shared/modules/Loader/store/LoaderStore';

export const FETCH_TRANSACTIONS = 'FETCH_TRANSACTIONS';

@injectable()
export class TransactionsStore extends RealtimeBaseStore {
  @inject(AxiosWrapper)
  api: AxiosWrapper;

  @inject(LoaderStore)
  loaderStore: LoaderStore;

  @observable transactionsMap = new Map<string, TransactionModel>();
  @observable statusChanged : boolean = false;

  @observable fee : string = '';
  @observable toAmount : string = '';
  @observable fromAmount : string = '';

  constructor() {
    super();

    this.adminSocket.on(TransactionsSocketMessages.AddTransaction, this.addTransaction);
  }

  @action.bound
  async addTransaction(transaction: IOutTransactionDTO) {
    const model = await TransactionModel.create(transaction);

    this.transactionsMap.set(model.referenceId, model);

    notification.info({
      message: 'New pending transaction!',
      description: `Reference ID: ${model.referenceId}`,
    });
  }
  
  @action.bound
  async fetchTransactions(filters?: IInTransactionsFiltersDTO) {
    this.loaderStore.addTask(FETCH_TRANSACTIONS);

    this.transactionsMap.clear();
    try {
      const transactions: IOutTransactionDTO[] = await this.api.post('/admin/transactions', filters);
      runInAction(() => {
        transactions.forEach(async transaction => {
          this.transactionsMap.set(transaction.referenceId, await TransactionModel.create(transaction));
        });
      });
    } catch (err) {
      notification.error({
        message: 'Error fetching transactions',
        description: err.toString(),
      });
    }

    this.loaderStore.removeTask(FETCH_TRANSACTIONS);
  }

  @action.bound
  async changeFeeTransaction(referenceId: string, fee: string) {
    try {
      const transaction = await this.getTransactionByReferenceId(referenceId);
      const doRequestTransaction = this.fee !== transaction.feeString;

      if (doRequestTransaction) {
        await this.api.put(`/admin/transactions/${referenceId}/fee_amount`,{
          exchangeFeeAmount: transaction.exchange ? fee : undefined,
          depositFeeAmount: transaction.deposit ? fee : undefined,
          withdrawalFeeAmount: transaction.withdrawal ? fee : undefined,
        });
      }
    } catch (e) {
      notification.error({
        message: 'Error changing fee',
      });
    }
  }

  @action.bound
  async changeToAmountTransaction(referenceId: string, amount: string) {
    try {
      const transaction = await this.getTransactionByReferenceId(referenceId);
      const doRequestTransaction = this.toAmount !== transaction.toAmount.toString();

      if (doRequestTransaction) {
        await this.api.put(`/admin/transactions/pending/${referenceId}/amount`, {
          exchangeToAmount: amount,
        });
      }
    } catch (e) {
      notification.error({
        message: 'Error changing to amount',
      });
    }
  }

  @action.bound
  async changeFromAmountTransaction(referenceId: string, amount: string) {
    try {
      const transaction = await this.getTransactionByReferenceId(referenceId);
      const doRequestTransaction = this.fromAmount !== transaction.fromAmount.toString();

      if (doRequestTransaction) {
        await this.api.put(`/admin/transactions/pending/${referenceId}/amount`, {
          depositFromAmount: transaction.deposit ? amount : undefined,
          withdrawalFromAmount: transaction.withdrawal ? amount : undefined,
          exchangeFromAmount: transaction.exchange ? amount : undefined,
        });
      }
    } catch (e) {
      notification.error({
        message: 'Error changing from amount',
      });
    }
  }

  @action.bound
  async getTransactionByReferenceId(referenceId: string): Promise<TransactionModel> {
    if (this.transactionsMap.has(referenceId)) {
      return this.transactionsMap.get(referenceId);
    }

    const transactionDTO = await this.api.get(`/admin/transactions/${referenceId}/info`);

    return TransactionModel.create(transactionDTO);
  }

  @action
  async changeTransactionStatus(referenceId: string, status: TransactionStatus, rejectReason?: string) {
    try {
      await this.api.put(`/admin/transactions/${referenceId}/status`, {
        status,
        rejectReason,
      });

      if (this.transactionsMap.has(referenceId)) {
        const transaction = this.transactionsMap.get(referenceId);
        transaction.status = status;
        transaction.rejectReason = rejectReason;

        this.transactionsMap.set(referenceId, transaction);
      }
    } catch (err) {
      console.log(err);
    }
  }

  @computed
  get transactions() {
    return Array.from(this.transactionsMap.values());
  }

  @action
  transactionsType(type: TransactionType, status?: TransactionStatus) {
    if (status) {
      return this.transactions.filter(item => item.type === type && item.status === status);
    } else {
      return this.transactions.filter(item => item.type === type);
    }
  }
}