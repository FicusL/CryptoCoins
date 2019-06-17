export enum CounterpartyTransactionStepsEnum {
  TransactionNotActivated = 'transaction_not_activated',

  NotKyc = 'not_kyc',
  KycPending = 'kyc_pending',
  KycRejected = 'kyc_rejected',

  TransactionPending = 'transaction_pending',
  TransactionCompleted = 'transaction_completed',
  TransactionRejected = 'transaction_rejected',
}