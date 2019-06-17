export interface IOutClientsTransactionsDTO {
  transactionId: number;
  email: string;
  pairId: number;
  paymentAmount: string;
  receiptAmount: string;
  fee: number;
  wallet: string;
}