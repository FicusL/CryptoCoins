import { TransactionDepositMethodType } from '../const/TransactionDepositMethodType';

export interface ITransactionPaymentMethod {
  type: TransactionDepositMethodType;
  data: TransactionPaymentMethodData;
}

type TransactionPaymentMethodData =
  IBankAccountPaymentMethodData |
  IZichangeWalletPaymentMethodData;

export interface IBankAccountPaymentMethodData {
  bankAccountName: string;
  bankAccountCurrency: string;
  bankAccountIBAN: string;
  bankAccountSWIFT: string;
}

export interface IZichangeWalletPaymentMethodData {
  zichangeWalletCurrency: string;
}