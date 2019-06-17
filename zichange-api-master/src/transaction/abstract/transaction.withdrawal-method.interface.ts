import { IBankAccount } from '../../core/abstract/core.bank.account.interface';
import { TransactionWithdrawalMethodType } from '../const/transaction.withdrawal-method.enum';

export type ITransactionWithdrawalMethod = {
  type: TransactionWithdrawalMethodType.BankAccount,
  data: IBankAccountWithdrawalMethodData,
} | {
  type: TransactionWithdrawalMethodType.CryptoWallet,
  data: ICryptoWalletWithdrawalMethodData,
};

export type IBankAccountWithdrawalMethodData = IBankAccount;

export interface ICryptoWalletWithdrawalMethodData {
  label: string;
  currency: string;
  address: string;
}