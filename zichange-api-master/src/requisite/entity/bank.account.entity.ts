import { Column, Entity } from 'typeorm';
import { BaseRequisiteEntity } from './base.requisite.entity';
import { IBankAccount } from '../../core/abstract/core.bank.account.interface';

@Entity({ name: 'bank_accounts' })
export class BankAccountEntity extends BaseRequisiteEntity implements IBankAccount {
  @Column()
  bankName: string;

  @Column()
  currency: string;

  @Column()
  IBAN: string;

  @Column()
  BIC: string;

  @Column()
  recipientName: string;
}