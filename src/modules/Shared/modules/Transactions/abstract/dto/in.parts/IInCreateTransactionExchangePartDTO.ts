import { IInTransactionOperationDataDTO } from './IInTransactionOperationDataDTO';

export interface IInCreateTransactionExchangePartDTO {
  isActive: boolean;
  from: IInTransactionOperationDataDTO;
  to: IInTransactionOperationDataDTO;
}