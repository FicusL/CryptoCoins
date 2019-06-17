import { FeeType } from '../../../../Fees/const/FeeType';
import { IOutTransactionOperationDataPartDTO } from './IOutTransactionOperationDataPartDTO';
import BigNumber from 'bignumber.js';

export interface IOutTransactionOperationFeePartDTO extends IOutTransactionOperationDataPartDTO {
  key: string;
  type: FeeType;
  value: BigNumber;
  amount: BigNumber;
}