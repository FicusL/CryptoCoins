import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteBankAccountCommand } from '../../../requisite/commands/delete-bank-account.command';
import { TransactionService } from '../../service/transaction.service';

@CommandHandler(DeleteBankAccountCommand)
export class TransactionDeleteBankAccountHandler implements ICommandHandler<DeleteBankAccountCommand> {
  constructor(
    private readonly transactionService: TransactionService,
  ) { }

  async execute(command: DeleteBankAccountCommand, resolve: (value?) => void) {
    await this.transactionService.processDeleteBankAccount(command.bankAccountId);
    resolve();
  }
}