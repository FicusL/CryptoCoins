import { IOutTransactionOperationDataPartDTO } from './IOutTransactionOperationDataPartDTO';
import { IOutTransactionOperationFeePartDTO } from './IOutTransactionOperationFeePartDTO';
import BigNumber from 'bignumber.js';

export interface IOutTransactionExchangePartDTO {
  from: IOutTransactionOperationDataPartDTO;
  to: IOutTransactionOperationDataPartDTO;
  fee: IOutTransactionOperationFeePartDTO;
  rate?: BigNumber;
}
