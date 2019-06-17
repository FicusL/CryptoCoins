import { CreateDateColumn } from 'typeorm';
import { ManyToOne } from 'typeorm';
import { RelationId } from 'typeorm';
import { AccountEntity } from '../../../account/entitiy/account.entity';
import { TransactionEntity } from '../transaction.entity';

export class TransactionCreationEmbedded {
  @CreateDateColumn()
  date: Date;

  @ManyToOne(type => AccountEntity, (account: AccountEntity) => account.createdTransactions)
  creationAccount: AccountEntity;

  @RelationId((entity: TransactionEntity) => entity.creation.creationAccount)
  creationAccountId: number;

  constructor(data?: Partial<TransactionCreationEmbedded>) {
    if (!data) {
      return;
    }

    Object.assign(this, data);
  }
}