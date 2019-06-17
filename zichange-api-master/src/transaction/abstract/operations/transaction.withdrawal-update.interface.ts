import { TransactionWithdrawalMethodType } from '../../const/transaction.withdrawal-method.enum';

export interface ITransactionWithdrawalUpdate {
  accountId: number;
  referenceId: string;

  method: {
    type: TransactionWithdrawalMethodType,
    id: number,
  };

  code?: string;
}