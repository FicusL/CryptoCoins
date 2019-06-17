import { ICommand } from '@nestjs/cqrs';

export class DeleteBankAccountCommand implements ICommand {
  constructor(
    public readonly bankAccountId: number,
  ) { }
}