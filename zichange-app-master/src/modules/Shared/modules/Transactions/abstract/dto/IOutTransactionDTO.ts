import { TransactionStatus } from '../../const/TransactionStatus';
import { TransactionType } from '../../const/TransactionType';
import { IOutTransactionDepositPartDTO } from './out.parts/IOutTransactionDepositPartDTO';
import { IOutTransactionExchangePartDTO } from './out.parts/IOutTransactionExchangePartDTO';
import { IOutTransactionWithdrawalPartDTO } from './out.parts/IOutTransactionWithdrawalPartDTO';
import { IOutTransactionCreationPartDTO } from './out.parts/IOutTransactionCreationPartDTO';

export interface IOutTransactionDTO {
  id: number;
  status: TransactionStatus;
  expectedDate: Date;
  possibleStatuses: TransactionStatus[];
  referenceId: string;
  deposit?: IOutTransactionDepositPartDTO;
  exchange?: IOutTransactionExchangePartDTO;
  withdrawal?: IOutTransactionWithdrawalPartDTO;
  creation?: IOutTransactionCreationPartDTO;
  type: TransactionType;
  rejectReason?: string;
  rejectStatus?: TransactionStatus;
  counterpartyWallet?: string;
  email: string;
}