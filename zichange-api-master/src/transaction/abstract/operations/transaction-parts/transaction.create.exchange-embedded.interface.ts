import { ITransactionCreateOperationDataEmbeddedFull } from './transaction.create.operation-data-embedded.interface';
import { ITransactionCreateOperationDataEmbeddedCurrency } from './transaction.create.operation-data-embedded.interface';

export interface ITransactionCreateExchangeEmbedded {
  from: ITransactionCreateOperationDataEmbeddedFull;
  to: ITransactionCreateOperationDataEmbeddedCurrency;
}