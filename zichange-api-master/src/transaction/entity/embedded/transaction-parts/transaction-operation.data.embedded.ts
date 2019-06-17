import { Column } from 'typeorm';
import { BigNumberValueTransformer } from '../../../../core/util/bignumber.value.transformer';
import { BigNumber } from 'bignumber.js';
import {
  ITransactionCreateOperationDataEmbeddedFull,
} from '../../../abstract/operations/transaction-parts/transaction.create.operation-data-embedded.interface';

export class TransactionOperationDataEmbedded implements Partial<ITransactionCreateOperationDataEmbeddedFull> {
  @Column({ nullable: true })
  currency: string;

  @Column({ type: 'decimal', nullable: true, default: '0', precision: 128, scale: 8, transformer: new BigNumberValueTransformer(8) })
  amount: BigNumber;

  constructor(data?: Partial<TransactionOperationDataEmbedded>) {
    if (!data) {
      return;
    }

    Object.assign(this, data);
  }
}