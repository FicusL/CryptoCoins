import { TransactionDepositMethodType } from '../../../const/TransactionDepositMethodType';

export interface IOutTransactionZichangeRequisitesDTO {
  type: TransactionDepositMethodType;
  data: any;
}