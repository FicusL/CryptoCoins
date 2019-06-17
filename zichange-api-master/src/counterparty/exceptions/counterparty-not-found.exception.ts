import { NotFoundException } from '@nestjs/common';
import { CounterpartyExceptionsCodes } from '../const/counterparty.exceptions-codes.enum';
import { IExceptionMessage } from '../../core/errors/error.payload';
import { counterpartyModuleName } from '../const/counterparty.module.name';

export class CounterpartyNotFoundException extends NotFoundException {
  constructor() {
    super([
      {
        code: CounterpartyExceptionsCodes.CounterpartyNotFound,
        description: 'Counterparty not found',
        module: counterpartyModuleName,
      },
    ] as IExceptionMessage);
  }
}