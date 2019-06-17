import { ICommand } from '@nestjs/cqrs';

export class DeleteCryptoWalletCommand implements ICommand {
  constructor(
    public readonly cryptoWalletId: number,
  ) { }
}