import {Column, CreateDateColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {AccountEntity} from '../../account/entitiy/account.entity';

export abstract class BaseRequisiteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @CreateDateColumn({ type: 'timestamptz' })
  creation: Date;

  @ManyToOne(type => AccountEntity, account => account.transactions)
  account: AccountEntity;
}