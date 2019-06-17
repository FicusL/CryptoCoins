import { IEvent } from '@nestjs/cqrs';

export class AccountCreatedLtcWalletEvent implements IEvent {
  constructor(
    public readonly walletAddress: string,
  ) { }
}