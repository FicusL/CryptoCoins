import { Column, ColumnOptions } from 'typeorm';
import { ITransactionDepositMethod } from '../../../abstract/transaction.deposit-method.interface';
import { BigNumberValueTransformer } from '../../../../core/util/bignumber.value.transformer';
import { BigNumber } from 'bignumber.js';
import { ITransactionZichangeRequisites } from '../../../abstract/transaction.zichange-requisites.interface';
import { TransactionOperationFeeEmbedded } from './transaction-operation.fee.embedded';
import { TransactionOperationDataEmbedded } from './transaction-operation.data.embedded';
import { ITransactionCreateDepositEmbedded } from '../../../abstract/operations/transaction-parts/transaction.create.deposit-embedded.interface';
import { TransactionStatus } from '../../../const/transaction.status.enum';

export class TransactionDepositEmbedded extends TransactionOperationDataEmbedded implements ITransactionCreateDepositEmbedded {
  static readonly ADDITIONAL_STATUSES = [ TransactionStatus.Approved, TransactionStatus.PaymentFailed ];
  static readonly EXPECTED_DAYS = 3;

  @Column({ default: false })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true } as ColumnOptions)
  method: ITransactionDepositMethod;

  @Column({ type: 'jsonb', nullable: true } as ColumnOptions)
  zichangeRequisites: ITransactionZichangeRequisites;

  @Column({ default: false })
  paid: boolean;

  @Column({ nullable: true })
  btcBlockchainIndex?: number;

  @Column({ nullable: true })
  ethTxHash?: string;

  @Column({ nullable: true })
  zcnTxHash?: string;

  @Column({type: 'decimal', nullable: true, default: '0', precision: 128, scale: 8, transformer: new BigNumberValueTransformer(8) })
  externalEUREquivalent: BigNumber;

  @Column(type => TransactionOperationFeeEmbedded)
  fee: TransactionOperationFeeEmbedded;

  constructor(data?: Partial<TransactionDepositEmbedded>) {
    super(data);

    if (!data) {
      return;
    }

    Object.assign(this, data);

    this.fee = new TransactionOperationFeeEmbedded(data.fee);
  }
}