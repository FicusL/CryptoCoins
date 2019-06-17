import { TransactionWithdrawalMethodType } from '../../../const/TransactionWithdrawalMethodType';
import { IInTransactionOperationDataDTO } from './IInTransactionOperationDataDTO';

export interface IInCreateTransactionWithdrawalPartDTO extends IInTransactionOperationDataDTO {
  isActive: boolean;
  type: TransactionWithdrawalMethodType;
  methodId: number;
}