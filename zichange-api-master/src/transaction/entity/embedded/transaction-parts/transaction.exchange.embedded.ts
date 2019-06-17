import { Column, ManyToOne } from 'typeorm';
import { BigNumberValueTransformer } from '../../../../core/util/bignumber.value.transformer';
import { BigNumber } from 'bignumber.js';
import { TransactionOperationFeeEmbedded } from './transaction-operation.fee.embedded';
import { TransactionOperationDataEmbedded } from './transaction-operation.data.embedded';
import { ITransactionCreateExchangeEmbedded } from '../../../abstract/operations/transaction-parts/transaction.create.exchange-embedded.interface';
import { IndexEntity } from '../../../../index/entity/index.entity';

export class TransactionExchangeEmbedded implements ITransactionCreateExchangeEmbedded {
  static readonly ADDITIONAL_STATUSES = [];
  static readonly EXPECTED_DAYS = 1;

  @Column({ default: false })
  isActive: boolean;

  @Column(type => TransactionOperationDataEmbedded)
  from: TransactionOperationDataEmbedded;

  @ManyToOne(type => IndexEntity, { nullable: true })
  fromIndex?: IndexEntity; // for transaction with indexes

  @Column({type: 'decimal', nullable: false, default: '0', precision: 128, scale: 8, transformer: new BigNumberValueTransformer(8) })
  fromAmountEUREquivalent: BigNumber;

  @Column(type => TransactionOperationDataEmbedded)
  to: TransactionOperationDataEmbedded;

  @ManyToOne(type => IndexEntity, { nullable: true })
  toIndex?: IndexEntity; // for transaction with indexes

  @Column({type: 'decimal', nullable: false, default: '0', precision: 128, scale: 8, transformer: new BigNumberValueTransformer(8) })
  toAmountEUREquivalent: BigNumber;

  @Column({type: 'decimal', nullable: true, default: '0', precision: 128, scale: 8, transformer: new BigNumberValueTransformer(8) })
  rate: BigNumber | undefined; // example: 1 BTC costs 6000 USD, from BTC to USD, rate = 6000

  @Column(type => TransactionOperationFeeEmbedded)
  fee: TransactionOperationFeeEmbedded;

  constructor(data?: Partial<TransactionExchangeEmbedded>) {
    if (!data) {
      return;
    }

    Object.assign(this, data);

    this.from = new TransactionOperationDataEmbedded(data.from);
    this.to = new TransactionOperationDataEmbedded(data.to);
    this.fee = new TransactionOperationFeeEmbedded(data.from);
  }
}