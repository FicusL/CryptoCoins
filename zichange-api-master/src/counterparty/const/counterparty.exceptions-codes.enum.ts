export enum CounterpartyExceptionsCodes {
  CounterpartyNotFound           = 0,
  AccountAlreadyCounterparty     = 1,
  CounterpartyApiKeyNotFound     = 2,
  IncorrectHeaders               = 3,
  IncorrectSignature             = 4,
  CurrencyPairNotFound           = 5,
  CurrencyPairNotActive          = 6,
  MaximumLogoSizeExceeded        = 7,
  CounterpartyLogoIsAbsent       = 8,
  CounterpartyLogoNotSpecified   = 9,
  IpAddressHasIncorrectFormat    = 10,
  IpAddressIsNotAllowed          = 11,
  BadNonce                       = 12,
  UnknownCurrency                = 13,
  TransactionAlreadyActivated    = 14,
  TransactionNotActivated        = 15,
  ActivationCodeAlreadySent      = 16,
  CanNotDefineTransactionStep    = 17,
}