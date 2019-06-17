import { TransactionType } from '../../../../Shared/modules/Transactions/const/TransactionType';
import { TransactionStatus } from '../../../../Shared/modules/Transactions/const/TransactionStatus';

export interface IInTransactionsFiltersDTO {
  status?: TransactionStatus;
  type?: TransactionType;
  beginDate?: number;
  endDate?: number;
  accountId?: number;
}