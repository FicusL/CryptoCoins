import { Entity, OneToOne } from 'typeorm';
import { AccountEntity } from './account.entity';
import { PrimaryGeneratedColumn } from 'typeorm';
import { JoinColumn } from 'typeorm';

@Entity({ name: 'invite_codes' })
export class InviteCodeEntity {
  @PrimaryGeneratedColumn('uuid')
  code: string;

  @OneToOne(type => AccountEntity, { nullable: true, eager: true })
  @JoinColumn()
  account?: AccountEntity;

  get isFree() {
    return !this.account;
  }
}