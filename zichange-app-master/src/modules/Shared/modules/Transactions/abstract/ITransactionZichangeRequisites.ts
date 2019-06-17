import { TransactionDepositMethodType } from '../const/TransactionDepositMethodType';

export interface ITransactionZichangeRequisites {
  type: TransactionDepositMethodType;
  data: TransactionZichangeRequisitesData;
}

type TransactionZichangeRequisitesData =
  IBankAccountZichangeRequisitesData |
  ICryptoWalletZichangeRequisitesData;

export interface IBankAccountZichangeRequisitesData {
  bankName: string;
  currency: string;
  IBAN: string;
  BIC: string;
}

export interface ICryptoWalletZichangeRequisitesData {
  currency: string;
  address: string;
}