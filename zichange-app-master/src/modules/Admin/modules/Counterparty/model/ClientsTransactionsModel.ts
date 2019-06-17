import { IOutClientsTransactionsDTO } from '../dto/IOutClientsTransactionsDTO';

export class ClientsTransactionsModel {
  transactionId: number;
  email: string;
  pairId: number;
  paymentAmount: string;
  receiptAmount: string;
  fee: number;
  wallet: string;

  constructor(dto: IOutClientsTransactionsDTO) {
    this.transactionId = dto.transactionId;
    this.pairId = dto.pairId;
    this.email = dto.email;
    this.fee = dto.fee;
    this.wallet = dto.wallet;
    this.paymentAmount = dto.paymentAmount;
    this.receiptAmount = dto.receiptAmount;
  }
}