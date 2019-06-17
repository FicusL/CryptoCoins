import {TransactionWithdrawalMethodType} from '../../../const/transaction.withdrawal-method.enum';
import {CryptoWalletEntity} from '../../../../requisite/entity/crypto.wallet.entity';
import {BankAccountEntity} from '../../../../requisite/entity/bank.account.entity';
import {ITransactionWithdrawalMethod} from '../../transaction.withdrawal-method.interface';

export interface ITransactionWithdrawalMethodEmbedded {
  type: TransactionWithdrawalMethodType;
  cryptoWallet?: CryptoWalletEntity;
  bankAccount?: BankAccountEntity;
  method?: ITransactionWithdrawalMethod;
}