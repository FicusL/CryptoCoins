import { IEvent } from '@nestjs/cqrs';

export class AccountCreatedZcnWalletEvent implements IEvent {
  constructor(
    public readonly walletAddress: string,
  ) { }
}