import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, RelationId, UpdateDateColumn } from 'typeorm';
import { AccountEntity } from './account.entity';
import * as crypto from 'crypto';

@Entity({ name: 'change_email_requests' })
export class AccountChangeEmailRequestEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ManyToOne(type => AccountEntity, { nullable: false })
  account?: AccountEntity;

  @RelationId((requestEntity: AccountChangeEmailRequestEntity) => requestEntity.account)
  accountId: number;

  @Index()
  @Column({ unique: true, nullable: false })
  activationToken: string;

  @Index()
  @Column({ type: 'citext', nullable: false })
  newEmail: string;

  @Column({ default: true, nullable: false })
  isActive: boolean;

  @CreateDateColumn()
  creationDate: Date;

  @UpdateDateColumn()
  lastEditDate: Date;

  public static generateToken(account: AccountEntity): string {
    const randomBytes = crypto.randomBytes(8).toString('base64');
    return crypto.createHash('sha256').update(randomBytes  + account.id + account.email + Date.now()).digest('hex');
  }
}