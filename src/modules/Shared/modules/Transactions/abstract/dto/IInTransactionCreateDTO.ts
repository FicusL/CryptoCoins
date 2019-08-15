import { TransactionType } from '../../const/TransactionType';
import { IInCreateTransactionDepositPartDTO } from './in.parts/IInCreateTransactionDepositPartDTO';
import { IInCreateTransactionExchangePartDTO } from './in.parts/IInCreateTransactionExchangePartDTO';
import { IInCreateTransactionWithdrawalPartDTO } from './in.parts/IInCreateTransactionWithdrawalPartDTO';

export interface IInTransactionCreateDTO {
  type: TransactionType;

  deposit?: IInCreateTransactionDepositPartDTO;
  exchange?: IInCreateTransactionExchangePartDTO;
  withdrawal?: IInCreateTransactionWithdrawalPartDTO;

  code2FA?: string;
}