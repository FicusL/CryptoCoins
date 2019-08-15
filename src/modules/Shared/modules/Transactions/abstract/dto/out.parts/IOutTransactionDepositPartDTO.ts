import { IOutTransactionOperationDataPartDTO } from './IOutTransactionOperationDataPartDTO';
import { IOutTransactionOperationFeePartDTO } from './IOutTransactionOperationFeePartDTO';
import { IOutTransactionDepositMethodDTO } from './IOutTransactionDepositMethodDTO';
import { IOutTransactionZichangeRequisitesDTO } from './IOutTransactionZichangeRequisitesDTO';
import BigNumber from 'bignumber.js';

export interface IOutTransactionDepositPartDTO extends IOutTransactionOperationDataPartDTO {
  method: IOutTransactionDepositMethodDTO;
  zichangeRequisites: IOutTransactionZichangeRequisitesDTO;
  paid: boolean;
  externalEUREquivalent: BigNumber;
  fee: IOutTransactionOperationFeePartDTO;
}