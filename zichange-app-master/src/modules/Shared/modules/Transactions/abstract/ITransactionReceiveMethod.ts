import { TransactionWithdrawalMethodType } from '../const/TransactionWithdrawalMethodType';

export interface ITransactionReceiveMethod {
  type: TransactionWithdrawalMethodType;
  data: TransactionReceiveMethodData;
}

export type TransactionReceiveMethodData =
  IBankAccountReceiveMethodData |
  ICryptoWalletReceiveMethodData |
  IZichangeWalletReceiveMethodData;

export interface IBankAccountReceiveMethodData {
  bankAccountName: string;
  bankAccountCurrency: string;
  bankAccountIBAN: string;
  bankAccountSWIFT: string;
}

export interface ICryptoWalletReceiveMethodData {
  cryptoWalletCurrency: string;
  cryptoWalletAddress: string;
}

export interface IZichangeWalletReceiveMethodData {
  zichangeWalletCurrency: string;
}