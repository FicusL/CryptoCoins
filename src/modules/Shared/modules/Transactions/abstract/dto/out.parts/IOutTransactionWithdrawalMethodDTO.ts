import { TransactionWithdrawalMethodType } from '../../../const/TransactionWithdrawalMethodType';

export interface IOutTransactionWithdrawalMethodDTO {
  type: TransactionWithdrawalMethodType;
  data: any;
}