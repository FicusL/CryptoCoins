export enum TransactionWithdrawalMethodType {
  BankAccount = 'bank_account',
  CryptoWallet = 'crypto_wallet',
  CounterpartyCryptoWallet = 'counterparty_crypto_wallet',

  AdvancedCash = 'advanced_cash', // TODO: this is not used when creating transaction
  Payeer = 'payeer', // TODO: this is not used when creating transaction
}