import { TransactionStatus } from '../const/transaction.status.enum';
import { TransactionType } from '../const/transaction.type.enum';

export interface ITransactionGetFilters {
  amount?: number;
  offset?: number;
  status?: TransactionStatus;
  type?: TransactionType;
  beginDate?: Date;
  endDate?: Date;
  account?: { id: number };
  counterparty?: { id: number };
}