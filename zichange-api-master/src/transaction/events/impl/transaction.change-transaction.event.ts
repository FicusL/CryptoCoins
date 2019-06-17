import { IEvent } from '@nestjs/cqrs';
import { TransactionEntity } from '../../entity/transaction.entity';

export class TransactionChangeTransactionEvent implements IEvent {
  public readonly oldTransaction: TransactionEntity;
  public readonly newTransaction: TransactionEntity;

  constructor(data: TransactionChangeTransactionEvent) {
    this.oldTransaction = data.oldTransaction;
    this.newTransaction = data.newTransaction;
  }
}