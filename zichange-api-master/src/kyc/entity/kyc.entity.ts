import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, RelationId, UpdateDateColumn } from 'typeorm';
import { AccountEntity } from '../../account/entitiy/account.entity';
import { KycStatus } from '../const/kyc.status';
import { SumsubReviewStatuses } from '../sumsub/types/sumsub.review-statuses';
import { ISumsubCreateApplicantInfo } from '../sumsub/types/create-applicant/sumsub.create-applicant-info.interface';

@Entity({ name: 'kyc' })
export class KycEntity {
  @OneToOne(type => AccountEntity, account => account.kyc, { cascade: true })
  @JoinColumn()
  account: AccountEntity;

  @RelationId((kyc: KycEntity) => kyc.account)
  accountId: number;

  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ nullable: true })
  phone?: string;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  lastEditDate: Date;

  @ManyToOne(type => AccountEntity)
  lastEditBy: AccountEntity;

  @Column({ enum: KycStatus })
  status: KycStatus;

  @Column({ nullable: true, type: 'jsonb' })
  frontendState?: object;

  @Column({ nullable: true })
  rejectReason?: string;

  @Column({ nullable: true })
  fileName?: string;

  @Column({ nullable: true })
  sumSubDocumentNumber?: string; // for finding duplicates

  @Column({ nullable: true })
  sumSubApplicantId?: string;

  @Column({ nullable: true })
  sumSubStatus?: SumsubReviewStatuses;

  @Column({ nullable: false, default: false })
  forbiddenSend: boolean;

  @Column({ nullable: true, type: 'jsonb' })
  lastSentSumSubInfo?: ISumsubCreateApplicantInfo;
}