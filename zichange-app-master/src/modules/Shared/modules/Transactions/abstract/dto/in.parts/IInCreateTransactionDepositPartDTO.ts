import { IInTransactionOperationDataDTO } from './IInTransactionOperationDataDTO';
import { TransactionDepositMethodType } from '../../../const/TransactionDepositMethodType';

export interface IInCreateTransactionDepositPartDTO extends IInTransactionOperationDataDTO {
  isActive: boolean;
  type: TransactionDepositMethodType;
}