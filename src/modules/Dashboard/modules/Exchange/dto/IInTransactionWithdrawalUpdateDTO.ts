import { TransactionWithdrawalMethodType } from '../../../../Shared/modules/Transactions/const/TransactionWithdrawalMethodType';

export interface IInTransactionWithdrawalUpdateDTO {
  methodType: TransactionWithdrawalMethodType;
  methodId: number;
  code: string;
}