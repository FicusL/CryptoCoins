export enum TransactionExceptionsCodes {
  UnknownError                    = 0,
  TransactionNotFound             = 1,
  BadValueSpecified               = 2,
  BankAccountNotFound             = 3,
  CryptoWalletNotFound            = 4,
  PaymentLimitExceeded            = 5,
  BadKYCStatus                    = 6,
  NotFoundCurrency                = 7,
  NotRealizedTransactionType      = 8, // if latter will be added new transaction types
  CurrenciesMustBeDifferent       = 9,
  CurrenciesMustBeEquals          = 10,
  TransactionTypeNotMatchEndPoint = 11,
  PaymentAmountLessThanMinimum    = 12,
  NotFoundFeeInfo                 = 13,
  NotFoundRate                    = 14,
  BadPaymentMethodType            = 15,
  BadReceiveMethodType            = 16,
  BadPaymentCurrency              = 17,
  BadReceiveCurrency              = 18,
  BadPaymentAmount                = 19,
  NotFoundMinPaymentAmount        = 20,
}