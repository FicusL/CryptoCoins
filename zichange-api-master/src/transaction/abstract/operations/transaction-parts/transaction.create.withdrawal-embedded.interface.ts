import { ITransactionCreateOperationDataEmbeddedFull } from './transaction.create.operation-data-embedded.interface';
import { TransactionWithdrawalMethodType } from '../../../const/transaction.withdrawal-method.enum';
import { BigNumber } from 'bignumber.js';
import {ITransactionWithdrawalMethodEmbedded} from './transaction.withdrawal.method.embedded.interface';

export interface ITransactionCreateWithdrawalEmbedded {
  method: {
    type: TransactionWithdrawalMethodType,
    id: number,
  };

  amount: BigNumber;
  currency: string;
  code?: string;
}

export interface ITransactionWithdrawalEmbedded extends ITransactionCreateOperationDataEmbeddedFull {
  method: ITransactionWithdrawalMethodEmbedded;
}