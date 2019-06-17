import { IEvent } from '@nestjs/cqrs';
import { TransactionEntity } from '../../entity/transaction.entity';
import { AccountEntity } from '../../../account/entitiy/account.entity';

export class TransactionAddTransactionEvent implements IEvent {
  public readonly transaction: TransactionEntity;
  public readonly account: AccountEntity;
  public readonly pushToRedis: boolean;

  constructor(data: TransactionAddTransactionEvent) {
    this.transaction = data.transaction;
    this.account = data.account;
    this.pushToRedis = data.pushToRedis;
  }
}