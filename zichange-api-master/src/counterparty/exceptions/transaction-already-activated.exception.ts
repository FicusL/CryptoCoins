import { BadRequestException } from '@nestjs/common';
import { CounterpartyExceptionsCodes } from '../const/counterparty.exceptions-codes.enum';
import { IExceptionMessage } from '../../core/errors/error.payload';
import { counterpartyModuleName } from '../const/counterparty.module.name';

export class TransactionAlreadyActivatedException extends BadRequestException {
  constructor() {
    super([
      {
        code: CounterpartyExceptionsCodes.TransactionAlreadyActivated,
        description: 'Transaction already activated',
        module: counterpartyModuleName,
      },
    ] as IExceptionMessage);
  }
}