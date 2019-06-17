import { ManyToOne } from 'typeorm';
import { RelationId } from 'typeorm';
import { UpdateDateColumn } from 'typeorm';
import { AccountEntity } from '../../../account/entitiy/account.entity';
import { TransactionEntity } from '../transaction.entity';

export class TransactionLastEditEmbedded {
  @UpdateDateColumn()
  date: Date;

  @ManyToOne(type => AccountEntity, (account: AccountEntity) => account.editedTransactions)
  editAccount: AccountEntity;

  @RelationId((entity: TransactionEntity) => entity.edit.editAccount)
  editAccountId: number;

  constructor(data?: Partial<TransactionLastEditEmbedded>) {
    if (!data) {
      return;
    }

    Object.assign(this, data);
  }
}