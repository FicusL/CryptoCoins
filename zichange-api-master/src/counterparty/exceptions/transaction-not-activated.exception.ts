import { ForbiddenException } from '@nestjs/common';
import { CounterpartyExceptionsCodes } from '../const/counterparty.exceptions-codes.enum';
import { IExceptionMessage } from '../../core/errors/error.payload';
import { counterpartyModuleName } from '../const/counterparty.module.name';

export class TransactionNotActivatedException extends ForbiddenException {
  constructor() {
    super([
      {
        code: CounterpartyExceptionsCodes.TransactionNotActivated,
        description: 'Transaction not activated',
        module: counterpartyModuleName,
      },
    ] as IExceptionMessage);
  }
}