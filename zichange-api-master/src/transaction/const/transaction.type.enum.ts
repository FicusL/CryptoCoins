export enum TransactionType {
  Deposit = 'Deposit',
  Withdrawal = 'Withdrawal',
  Exchange = 'Exchange',

  DepositExchange = 'DepositExchange',
  ExchangeWithdrawal = 'ExchangeWithdrawal',
  DepositExchangeWithdrawal = 'DepositExchangeWithdrawal',

  Referral = 'Referral',

  BuyBasket = 'BuyBasket',
  SellBasket = 'SellBasket',
  ManagementFee = 'ManagementFee',
}