import { TransactionOperationDataEmbedded } from './transaction-operation.data.embedded';
import { TransactionStatus } from '../../../const/transaction.status.enum';
import {Column} from 'typeorm';
import {BigNumberValueTransformer} from '../../../../core/util/bignumber.value.transformer';
import {BigNumber} from 'bignumber.js';

export class TransactionReferralEmbedded extends TransactionOperationDataEmbedded {
  static readonly ADDITIONAL_STATUSES = [ TransactionStatus.Referral ];

  @Column({ type: 'decimal', nullable: true, default: '0', precision: 128, scale: 8, transformer: new BigNumberValueTransformer(8) })
  transactionAmount: BigNumber;

  @Column({ type: 'decimal', nullable: true, default: '0', precision: 128, scale: 8, transformer: new BigNumberValueTransformer(8) })
  serviceFee: BigNumber;

  constructor(data?: Required<TransactionReferralEmbedded>) {
    super(data);

    if (!data) {
      return;
    }

    Object.assign(this, data);
  }
}