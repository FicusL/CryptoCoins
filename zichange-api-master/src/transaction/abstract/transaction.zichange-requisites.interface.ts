import { TransactionDepositMethodType } from '../const/transaction.deposit-method.enum';
import { IBankAccount } from '../../core/abstract/core.bank.account.interface';

export type ITransactionZichangeRequisites = {
  type: TransactionDepositMethodType.BankAccount,
  data: IBankAccountZichangeRequisitesData,
} | {
  type: TransactionDepositMethodType.CryptoWallet,
  data: ICryptoWalletZichangeRequisitesData,
} | {
  type: TransactionDepositMethodType.AdvancedCash | TransactionDepositMethodType.Payeer,
  data: {},
} | {
  type: TransactionDepositMethodType.BilderlingsBankCard,
  data: {},
} | {
  type: TransactionDepositMethodType.RoyalPayBankCard,
  data: {},
} | {
  type: TransactionDepositMethodType.RbkMoney,
  data: {},
};

type IBankAccountZichangeRequisitesData = IBankAccount;

export interface ICryptoWalletZichangeRequisitesData {
  currency: string;
  address: string;
}