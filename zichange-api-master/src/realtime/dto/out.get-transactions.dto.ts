import { OutTransactionDTO } from '../../transaction/dto/transaction/out.transaction.dto';

export class OutGetTransactionsDTO {
  transactions: OutTransactionDTO[];

  constructor(transactions: OutTransactionDTO[]) {
    this.transactions = transactions;
  }
}