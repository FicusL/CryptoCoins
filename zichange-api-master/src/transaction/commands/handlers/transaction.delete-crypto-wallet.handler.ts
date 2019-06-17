import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCryptoWalletCommand } from '../../../requisite/commands/delete-crypto-wallet.command';
import { TransactionService } from '../../service/transaction.service';

@CommandHandler(DeleteCryptoWalletCommand)
export class TransactionDeleteCryptoWalletHandler implements ICommandHandler<DeleteCryptoWalletCommand> {
  constructor(
    private readonly transactionService: TransactionService,
  ) { }

  async execute(command: DeleteCryptoWalletCommand, resolve: (value?) => void) {
    await this.transactionService.processDeleteCryptoWallet(command.cryptoWalletId);
    resolve();
  }
}