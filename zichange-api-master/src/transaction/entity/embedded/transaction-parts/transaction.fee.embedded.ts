import { Column } from 'typeorm';
import { BigNumberValueTransformer } from '../../../../core/util/bignumber.value.transformer';
import { BigNumber } from 'bignumber.js';

export class TransactionFeeEmbedded {
  @Column({ default: false })
  isActive: boolean;

  @Column({ nullable: true })
  currency: string;

  @Column({ type: 'decimal', nullable: true, default: '0', precision: 128, scale: 8, transformer: new BigNumberValueTransformer(8) })
  amount: BigNumber;

  @Column({ type: 'decimal', nullable: true, default: '0', precision: 128, scale: 8, transformer: new BigNumberValueTransformer(8) })
  externalEUREquivalent: BigNumber;

  constructor(data?: TransactionFeeEmbedded) {
    if (!data) {
      return;
    }

    Object.assign(this, data);
  }
}