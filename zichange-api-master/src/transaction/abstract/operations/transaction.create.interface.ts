import { TransactionType } from '../../const/transaction.type.enum';
import { TransactionStatus } from '../../const/transaction.status.enum';
import { ITransactionCreateDepositEmbedded } from './transaction-parts/transaction.create.deposit-embedded.interface';
import { ITransactionCreateExchangeEmbedded } from './transaction-parts/transaction.create.exchange-embedded.interface';
import { ITransactionCreateWithdrawalEmbedded } from './transaction-parts/transaction.create.withdrawal-embedded.interface';
import { AccountEntity } from '../../../account/entitiy/account.entity';
import { CurrencyPairEntity } from '../../entity/currency-pair.entity';
import { BigNumber } from 'bignumber.js';

export interface ITransactionCreate {
  type: TransactionType;
  status?: TransactionStatus;

  deposit?: ITransactionCreateDepositEmbedded;
  exchange?: ITransactionCreateExchangeEmbedded;
  withdrawal?: ITransactionCreateWithdrawalEmbedded;

  code2FA?: string;

  counterparty?: AccountEntity;
  counterpartyActivationToken?: string;
  counterpartyPair?: CurrencyPairEntity;
  counterpartyAmount?: BigNumber;
  counterpartyFee?: BigNumber;
  counterpartyWallet?: string;
}