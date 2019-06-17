import { IEvent } from '@nestjs/cqrs';

export class AccountCreatedBtcWalletEvent implements IEvent {
  constructor(
    public readonly walletAddress: string,
  ) { }
}