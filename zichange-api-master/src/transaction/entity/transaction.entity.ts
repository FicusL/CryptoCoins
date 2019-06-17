import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { TransactionStatus } from '../const/transaction.status.enum';
import { AccountEntity } from '../../account/entitiy/account.entity';
import { TransactionType } from '../const/transaction.type.enum';
import { TransactionDepositEmbedded } from './embedded/transaction-parts/transaction.deposit.embedded';
import { TransactionWithdrawalEmbedded } from './embedded/transaction-parts/transaction.withdrawal.embedded';
import { TransactionExchangeEmbedded } from './embedded/transaction-parts/transaction.exchange.embedded';
import { ITransactionCreate } from '../abstract/operations/transaction.create.interface';
import { TransactionCreationEmbedded } from './embedded/transaction.creation.embedded';
import { TransactionLastEditEmbedded } from './embedded/transaction.last-edit.embedded';
import { TransactionReferralEmbedded } from './embedded/transaction-parts/transaction.referral.embedded';
import { CurrencyPairEntity } from './currency-pair.entity';
import { BigNumberValueTransformer } from '../../core/util/bignumber.value.transformer';
import { BigNumber } from 'bignumber.js';
import { TransactionFeeEmbedded } from './embedded/transaction-parts/transaction.fee.embedded';
import moment = require('moment');

@Entity({ name: 'transactions' })
export class TransactionEntity implements ITransactionCreate {
  static readonly DEPOSIT_AVAILABLE_TYPES = [
    TransactionType.Deposit,
    TransactionType.DepositExchange,
    TransactionType.DepositExchangeWithdrawal,
  ];
  static readonly EXCHANGE_AVAILABLE_TYPES = [
    TransactionType.Exchange,
    TransactionType.DepositExchange,
    TransactionType.ExchangeWithdrawal,
    TransactionType.DepositExchangeWithdrawal,
    TransactionType.BuyBasket,
    TransactionType.SellBasket,
  ];
  static readonly WITHDRAWAL_AVAILABLE_TYPES = [
    TransactionType.DepositExchangeWithdrawal,
    TransactionType.ExchangeWithdrawal,
    TransactionType.Withdrawal,
  ];

  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ enum: TransactionStatus, default: TransactionStatus.Pending, nullable: false })
  status: TransactionStatus;

  @Column(type => TransactionDepositEmbedded)
  deposit: TransactionDepositEmbedded;

  @Column(type => TransactionExchangeEmbedded)
  exchange: TransactionExchangeEmbedded;

  @Column(type => TransactionWithdrawalEmbedded)
  // @ts-ignore
  withdrawal: TransactionWithdrawalEmbedded;

  @Column(type => TransactionFeeEmbedded)
  fee: TransactionFeeEmbedded;

  // region Counterparty data

  @ManyToOne(type => AccountEntity, { nullable: true })
  counterparty?: AccountEntity;

  @RelationId((transaction: TransactionEntity) => transaction.counterparty)
  counterpartyId?: number;

  @ManyToOne(type => CurrencyPairEntity, { nullable: true, eager: true })
  counterpartyPair?: CurrencyPairEntity;

  @RelationId((transaction: TransactionEntity) => transaction.counterpartyPair)
  counterpartyPairId?: number;

  @Column({type: 'decimal', nullable: true, default: '0', precision: 128, scale: 8, transformer: new BigNumberValueTransformer(8) })
  counterpartyAmount: BigNumber;

  @Column({type: 'decimal', nullable: true, default: '0', precision: 128, scale: 8, transformer: new BigNumberValueTransformer(8) })
  counterpartyFee: BigNumber;

  @Column({type: 'decimal', nullable: true, default: '0', precision: 128, scale: 8, transformer: new BigNumberValueTransformer(8) })
  counterpartyFeeEUREquivalent: BigNumber;

  @Column({ nullable: true })
  counterpartyWallet?: string;

  // endregion

  // region Counterparty activation data

  @Column({ unique: true, nullable: true, type: 'citext' })
  counterpartyActivationToken?: string;

  @Column({ nullable: true })
  counterpartyActivationCode?: string;

  @Column({ type: 'timestamptz', nullable: true, default: new Date(0) })
  counterpartyActivationCodeExpiration?: Date;

  @Column({ nullable: false, default: false })
  counterpartyIsActivated: boolean;

  // endregion

  // region Referral data

  @ManyToOne(type => AccountEntity, { nullable: true })
  referral?: AccountEntity;

  @RelationId((transaction: TransactionEntity) => transaction.referral)
  referralId?: number;

  @OneToOne(type => TransactionEntity)
  @JoinColumn()
  referralTransaction?: TransactionEntity;

  @RelationId((transaction: TransactionEntity) => transaction.referralTransaction)
  referralTransactionId?: number;

  @Column(type => TransactionReferralEmbedded)
  referralData: TransactionReferralEmbedded;

  // endregion

  @Column(type => TransactionCreationEmbedded)
  creation: TransactionCreationEmbedded;

  @Column(type => TransactionLastEditEmbedded)
  edit: TransactionLastEditEmbedded;

  @Index()
  @Column({ enum: TransactionType, nullable: false })
  type: TransactionType;

  @Column({ nullable: true })
  overriddenExpectedDate?: Date;

  @Column({ nullable: true })
  completedDate: Date;

  @Column({ nullable: true })
  rejectReason?: string;

  @Column({ nullable: true })
  rejectStatus?: TransactionStatus;

  @ManyToOne(type => AccountEntity, account => account.transactions)
  account: AccountEntity;

  @RelationId((transaction: TransactionEntity) => transaction.account)
  accountId: number;

  // region Getters

  get referenceId(): string {
    const accountPart = (this.accountId + 2000).toString(36).padStart(3, '0');
    const transactionPart = (this.id + 1700000).toString(36).padStart(5, '0');

    return `${accountPart}${transactionPart}`;
  }

  get expectedDate(): Date {
    if (this.status === TransactionStatus.Completed) {
      return this.completedDate;
    }

    if (this.overriddenExpectedDate) {
      return this.overriddenExpectedDate;
    }

    let expectedDaysToProceed = 0;

    const isDepositPartActive = this.deposit && this.deposit.isActive;
    if (isDepositPartActive) {
      expectedDaysToProceed += TransactionDepositEmbedded.EXPECTED_DAYS;
    }

    const isExchangePartActive = this.exchange && this.exchange.isActive;
    if (isExchangePartActive) {
      expectedDaysToProceed += TransactionExchangeEmbedded.EXPECTED_DAYS;
    }

    const isWithdrawalPartActive = this.withdrawal && this.withdrawal.isActive;
    if (isWithdrawalPartActive) {
      expectedDaysToProceed += TransactionWithdrawalEmbedded.EXPECTED_DAYS;
    }

    const creationDate = this.creation ? this.creation.date : new Date();
    return moment(creationDate).add(expectedDaysToProceed, 'days').toDate();
  }

  get possibleStatuses(): TransactionStatus[] {
    const result: TransactionStatus[] = [];

    if (this.type === TransactionType.Referral) {
      result.push(...TransactionReferralEmbedded.ADDITIONAL_STATUSES);
      return result;
    }

    result.push(TransactionStatus.Pending);

    const isDepositPartActive = this.deposit && this.deposit.isActive;
    if (isDepositPartActive) {
      result.push(...TransactionDepositEmbedded.ADDITIONAL_STATUSES);
    }

    const isExchangePartActive = this.exchange && this.exchange.isActive;
    if (isExchangePartActive) {
      if (isDepositPartActive) {
        result.push(TransactionStatus.BoundaryDepositApproved);
      }

      result.push(...TransactionExchangeEmbedded.ADDITIONAL_STATUSES);
    }

    const isWithdrawalPartActive = this.withdrawal && this.withdrawal.isActive;
    if (isWithdrawalPartActive) {
      if (isExchangePartActive) {
        result.push(TransactionStatus.BoundaryExchangeApproved);
      }

      result.push(...TransactionWithdrawalEmbedded.ADDITIONAL_STATUSES);
    }

    result.push(TransactionStatus.Completed);
    return result;
  }

  // endregion

  constructor(data?: Partial<TransactionEntity>) {
    if (!data) {
      return;
    }

    Object.assign(this, data);

    this.deposit = new TransactionDepositEmbedded(data.deposit);
    this.exchange = new TransactionExchangeEmbedded(data.exchange);
    this.withdrawal = new TransactionWithdrawalEmbedded(data.withdrawal);
    this.fee = new TransactionFeeEmbedded(data.fee);
    this.referralData = new TransactionReferralEmbedded(data.referralData);
    this.creation = new TransactionCreationEmbedded(data.creation);
    this.edit = new TransactionLastEditEmbedded(data.edit);
  }

  // region Static methods

  static getTransactionIdByReferenceId(referenceId: string): number {
   const transactionPart = referenceId.slice(3);
   return parseInt(transactionPart, 36) - 1700000;
  }

  static getAccountIdByReferenceId(referenceId: string): number {
    const accountPart = referenceId.slice(0, 2);
    return parseInt(accountPart, 36) - 2000;
  }

  // endregion
}