import * as crypto from 'crypto';

import {
  Column,
  CreateDateColumn,
  Entity,
  Index, JoinTable, ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { TransactionEntity } from '../../transaction/entity/transaction.entity';
import { CryptoWalletEntity } from '../../requisite/entity/crypto.wallet.entity';
import { BankAccountEntity } from '../../requisite/entity/bank.account.entity';
import { KycEntity } from '../../kyc/entity/kyc.entity';
import { AccountType } from '../const/account.type.enum';
import { InviteCodeEntity } from './invite-code.entity';
import { BigNumberValueTransformer } from '../../core/util/bignumber.value.transformer';
import { BigNumber } from 'bignumber.js';
import { KycTierLevel } from '../../kyc/const/kyc.tier-level.enum';
import { TransactionTierLevelLimits } from '../../transaction/const/transaction.tier-level-limits';

export const resetExpireTime = 3 * 24 * 60 * 60 * 1000;
export const loginByResetExpireTime = 60 * 60 * 1000;

@Entity({ name: 'accounts' })
export class AccountEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @CreateDateColumn()
  registrationDate: Date;

  @OneToOne(type => KycEntity, kyc => kyc.account, { eager: true })
  kyc: KycEntity | undefined;

  @Column({ nullable: false, default: false })
  isAdmin: boolean;

  @Column({ nullable: false, default: false })
  isTrader: boolean;

  @Column({ nullable: false, default: false })
  isAmlOfficer: boolean;

  @Index()
  @Column({ unique: true, nullable: false, type: 'citext' })
  email: string;

  @Column({ enum: AccountType, nullable: false, default: AccountType.Natural })
  type: AccountType;

  @Column({ nullable: false })
  passwordHash: string;

  @Column({ nullable: false })
  passwordSalt: string;

  @Column({ nullable: false, default: false })
  isActivated: boolean;

  @Index()
  @Column({ unique: true, nullable: true })
  activationToken: string;

  @Index()
  @Column({ unique: false, nullable: true })
  resetToken?: string;

  @Column({ type: 'timestamptz', nullable: true, default: new Date(0) })
  resetTokenExpiration: Date;

  @Column({ type: 'timestamptz', nullable: true, default: new Date(0) })
  loginByResetTokenExpiration: Date;

  @Column({ nullable: false, default: false })
  twoFaEnabled: boolean;

  @Column({ nullable: true })
  twoFaSecret?: string;

  @Column({ unique: false, nullable: true, type: 'citext' })
  btcWalletAddress: string | undefined;

  @Column({ unique: false, nullable: true, type: 'citext' })
  ethWalletAddress: string | undefined;

  @Column({ unique: false, nullable: true, type: 'int' })
  ethWalletAddressBitGoIndex: number | undefined;

  @Column({ unique: false, nullable: true, type: 'citext' })
  ltcWalletAddress: string | undefined;

  @Column({ unique: false, nullable: true, type: 'citext' })
  zcnWalletAddress: string | undefined;

  @Column({ unique: false, nullable: true, type: 'citext' })
  xrpWalletAddress: string | undefined;

  @Column({ unique: false, nullable: true, type: 'citext' })
  bchWalletAddress: string | undefined;

  @Column({ unique: false, nullable: true, type: 'citext' })
  xlmWalletAddress: string | undefined;

  @Column({ unique: false, nullable: true, type: 'citext' })
  dashWalletAddress: string | undefined;

  @Column({ unique: false, nullable: true, type: 'citext' })
  zecWalletAddress: string | undefined;

  @Column({ unique: false, nullable: true, type: 'citext' })
  bsvWalletAddress: string | undefined;

  @Column({ unique: false, nullable: true, type: 'citext' })
  btgWalletAddress: string | undefined;

  @ManyToOne(type => AccountEntity, { nullable: true })
  refer?: AccountEntity;

  @RelationId((account: AccountEntity) => account.refer)
  referId?: number;

  @Column({ nullable: false, default: true })
  isPartner: boolean;

  // region Counterparty

  @Column({ nullable: false, default: false })
  isCounterparty: boolean;

  @Column({ nullable: true })
  counterpartyName?: string;

  @Column({ nullable: false, default: false })
  mustRegister: boolean; // if account created via counterparty API => mustRegister = true

  @ManyToMany(type => AccountEntity)
  @JoinTable()
  counterpartyClients: AccountEntity[];

  @ManyToMany(type => AccountEntity)
  counterparties: AccountEntity[];

  // endregion

  // region Linked Accounts

  @OneToMany(type => AccountEntity, account => account.mainAccount)
  linkedAccounts: TransactionEntity[];

  @ManyToOne(type => AccountEntity, account => account.linkedAccounts)
  mainAccount: AccountEntity;

  @RelationId((account: AccountEntity) => account.mainAccount)
  mainAccountId?: number;

  // endregion

  // region Blocked information

  @Column({ nullable: false, default: false })
  isBlocked: boolean;

  @Column({ nullable: true })
  blockingReason?: string;

  // endregion

  @Column({ unique: true, nullable: true, type: 'citext' })
  referralToken?: string;

  @Column({type: 'decimal', nullable: true, default: '0', precision: 128, scale: 8, transformer: new BigNumberValueTransformer(8) })
  exchangeCommissionCoefficient?: BigNumber;

  @OneToMany(type => TransactionEntity, transaction => transaction.account)
  transactions: TransactionEntity[];

  @OneToMany(type => BankAccountEntity, bank => bank.account)
  bankAccounts: BankAccountEntity[];

  @OneToMany(type => CryptoWalletEntity, wallet => wallet.account)
  cryptoWallets: CryptoWalletEntity[];

  @OneToOne(type => InviteCodeEntity, { nullable: true })
  inviteCode?: InviteCodeEntity;

  @OneToMany(type => TransactionEntity, transaction => transaction.creation.creationAccount)
  createdTransactions: TransactionEntity;

  @OneToMany(type => TransactionEntity, transaction => transaction.edit.editAccount)
  editedTransactions: TransactionEntity;

  set password(value: string) {
    this.passwordSalt = crypto.randomBytes(32).toString('base64');
    this.passwordHash = AccountEntity.createPasswordHash(value + this.passwordSalt);
  }

  get hotWalletAddresses() {
    return {
      BTC: this.btcWalletAddress,
      ETH: this.ethWalletAddress,
      LTC: this.ltcWalletAddress,
      ZCN: this.zcnWalletAddress,

      XRP: this.xrpWalletAddress,
      BCH: this.bchWalletAddress,
      XLM: this.xlmWalletAddress,
      DASH: this.dashWalletAddress,
      ZEC: this.zecWalletAddress,
      BSV: this.bsvWalletAddress,
      BTG: this.btgWalletAddress,
    };
  }

  static getTierLevelLimitEUR(tierLevel: KycTierLevel): BigNumber {
    return TransactionTierLevelLimits[tierLevel] || new BigNumber('0');
  }

  public isPasswordValid(password: string) {
    return AccountEntity.createPasswordHash(password + this.passwordSalt) === this.passwordHash;
  }

  public static createPasswordHash(value: string) {
    return crypto.createHash('sha512').update(value).digest('base64');
  }

  public static generateCounterpartyActivationToken(email: string): string {
    const randomBytes = crypto.randomBytes(8).toString('base64');
    return crypto.createHash('sha256').update(randomBytes  + email + Date.now()).digest('hex');
  }

  public generatePasswordResetToken(): string {
    const randomBytes = crypto.randomBytes(8).toString('base64');
    return crypto.createHash('sha256').update(randomBytes  + this.id + this.email + Date.now()).digest('hex');
  }

  public generateActivationToken(): string {
    const randomBytes = crypto.randomBytes(8).toString('base64');
    return crypto.createHash('sha256').update(randomBytes + this.id + this.email + Date.now()).digest('hex');
  }

  public generateReferralToken(): string {
    const randomBytes = crypto.randomBytes(8).toString('base64');
    return crypto.createHash('sha256').update(randomBytes + this.id + this.email + Date.now()).digest('hex');
  }
}