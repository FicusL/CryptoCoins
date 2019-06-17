import { TransactionModel } from '../../../../../Shared/modules/Transactions/model/TransactionModel';

export interface IPaymentStore {
  payRequest(transaction: TransactionModel);
}