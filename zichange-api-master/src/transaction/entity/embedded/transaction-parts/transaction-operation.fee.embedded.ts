import { Column } from 'typeorm';
import { BigNumberValueTransformer } from '../../../../core/util/bignumber.value.transformer';
import { BigNumber } from 'bignumber.js';
import { FeeType } from '../../../../core/const/core.fee.type.enum';
import { TransactionOperationDataEmbedded } from './transaction-operation.data.embedded';

export class TransactionOperationFeeEmbedded extends TransactionOperationDataEmbedded {
  @Column({ nullable: true })
  key: string; // Pair or currency for fee (metadata)

  @Column({ enum: FeeType, nullable: true })
  type: FeeType;

  @Column({type: 'decimal', nullable: true, default: '0', precision: 128, scale: 8, transformer: new BigNumberValueTransformer(8) })
  value: BigNumber; // Coefficient or amount of fee settings

  constructor(data?: Partial<TransactionOperationFeeEmbedded>) {
    super(data);

    if (!data) {
      return;
    }

    Object.assign(this, data);
  }
}