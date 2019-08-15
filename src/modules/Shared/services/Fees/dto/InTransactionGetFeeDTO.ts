import { TransactionDepositMethodType } from '../../../modules/Transactions/const/TransactionDepositMethodType';
import { TransactionWithdrawalMethodType } from '../../../modules/Transactions/const/TransactionWithdrawalMethodType';

export class InTransactionGetFeeDTO {
  type: TransactionPartType;
  currency: string;
  amount: string;
  depositMethod?: TransactionDepositMethodType;
  withdrawalMethod?: TransactionWithdrawalMethodType;
}


export enum TransactionPartType {
  Deposit = 'Deposit',
  Exchange = 'Exchange',
  Withdrawal = 'Withdrawal',
}

// export enum TransactionWithdrawalMethodType {
//   BankAccount = 'bank_account',
//   CryptoWallet = 'crypto_wallet',
//
//   AdvancedCash = 'advanced_cash', // TODO: this is not used when creating transaction
//   Payeer = 'payeer', // TODO: this is not used when creating transaction
// }
