import { ITransactionDepositMethod } from '../../transaction.deposit-method.interface';
import { ITransactionCreateOperationDataEmbeddedFull } from './transaction.create.operation-data-embedded.interface';

export interface ITransactionCreateDepositEmbedded extends ITransactionCreateOperationDataEmbeddedFull {
  method: ITransactionDepositMethod;
  paid: boolean;

  btcBlockchainIndex?: number;
  ethTxHash?: string;
  zcnTxHash?: string;
}