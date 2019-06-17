export enum TransactionStatus {
  Rejected = 'Rejected',
  Pending = 'Pending',
  Approved = 'Approved',
  Transfer = 'Transfer',
  Completed = 'Completed',
  PaymentFailed = 'PaymentFailed',
  Referral = 'Referral',

  BoundaryDepositApproved = 'BoundaryDepositApproved',
  BoundaryExchangeApproved = 'BoundaryExchangeApproved',
}