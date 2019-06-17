export enum TransactionStatus {
  Rejected = 'Rejected',
  PaymentFailed = 'PaymentFailed',
  Pending = 'Pending',
  Approved = 'Approved',
  Transfer = 'Transfer',
  Completed = 'Completed',
  Referral = 'Referral',

  BoundaryDepositApproved = 'BoundaryDepositApproved', // NOTE: not used
  BoundaryExchangeApproved = 'BoundaryExchangeApproved', // NOTE: not used
}