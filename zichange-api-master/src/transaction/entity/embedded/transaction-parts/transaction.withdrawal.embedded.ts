import { Column } from 'typeorm';
import { BigNumberValueTransformer } from '../../../../core/util/bignumber.value.transformer';
import { BigNumber } from 'bignumber.js';
import { TransactionOperationFeeEmbedded } from './transaction-operation.fee.embedded';
import { TransactionOperationDataEmbedded } from './transaction-operation.data.embedded';
import { ITransactionWithdrawalEmbedded } from '../../../abstract/operations/transaction-parts/transaction.create.withdrawal-embedded.interface';
import { TransactionStatus } from '../../../const/transaction.status.enum';
import {TransactionWithdrawalMethodEmbedded} from './transaction.withdrawal.method.embedded';

export class TransactionWithdrawalEmbedded extends TransactionOperationDataEmbedded implements ITransactionWithdrawalEmbedded {
  static readonly ADDITIONAL_STATUSES = [TransactionStatus.Transfer];
  static readonly EXPECTED_DAYS = 3;

  @Column({ default: false })
  isActive: boolean;

  @Column(type => TransactionWithdrawalMethodEmbedded)
  method: TransactionWithdrawalMethodEmbedded;

  @Column({type: 'decimal', nullable: true, default: '0', precision: 128, scale: 8, transformer: new BigNumberValueTransformer(8) })
  externalEUREquivalent: BigNumber;

  @Column(type => TransactionOperationFeeEmbedded)
  fee: TransactionOperationFeeEmbedded;

  constructor(data?: Partial<TransactionWithdrawalEmbedded>) {
    super(data);

    if (!data) {
      return;
    }

    Object.assign(this, data);

    this.method = new TransactionWithdrawalMethodEmbedded(data.method);
    this.fee = new TransactionOperationFeeEmbedded(data.fee);
  }
}