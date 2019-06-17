import { BigNumber } from 'bignumber.js';

export interface ITransactionCreateOperationDataEmbeddedCurrency {
  currency: string;
}

export interface ITransactionCreateOperationDataEmbeddedFull extends ITransactionCreateOperationDataEmbeddedCurrency {
  amount: BigNumber;
}