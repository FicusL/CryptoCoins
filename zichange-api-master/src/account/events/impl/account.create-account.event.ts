import { IEvent } from '@nestjs/cqrs';
import { AccountEntity } from '../../entitiy/account.entity';

export class AccountCreateAccountEvent implements IEvent {
  constructor(
    public readonly account: AccountEntity,
  ) { }
}