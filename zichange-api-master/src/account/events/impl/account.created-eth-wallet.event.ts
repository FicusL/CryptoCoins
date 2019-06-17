import { IEvent } from '@nestjs/cqrs';

export class AccountCreatedEthWalletEvent implements IEvent {
  constructor(
    public readonly walletAddress: string,
  ) { }
}