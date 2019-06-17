import { TransactionDeleteBankAccountHandler } from './transaction.delete-bank-account.handler';
import { TransactionDeleteCryptoWalletHandler } from './transaction.delete-crypto-wallet.handler';

export const TransactionCommandHandlers = [
  TransactionDeleteBankAccountHandler,
  TransactionDeleteCryptoWalletHandler,
];