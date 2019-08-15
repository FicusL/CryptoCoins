import { IOutTransactionOperationFeePartDTO } from './IOutTransactionOperationFeePartDTO';
import { IOutTransactionWithdrawalMethodDTO } from './IOutTransactionWithdrawalMethodDTO';
import { IOutTransactionOperationDataPartDTO } from './IOutTransactionOperationDataPartDTO';
import BigNumber from 'bignumber.js';

export interface IOutTransactionWithdrawalPartDTO extends IOutTransactionOperationDataPartDTO {
  method: IOutTransactionWithdrawalMethodDTO;
  externalEUREquivalent: BigNumber;
  fee: IOutTransactionOperationFeePartDTO;
}