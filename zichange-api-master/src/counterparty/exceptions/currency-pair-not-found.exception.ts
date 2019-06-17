import { NotFoundException } from '@nestjs/common';
import { CounterpartyExceptionsCodes } from '../const/counterparty.exceptions-codes.enum';
import { IExceptionMessage } from '../../core/errors/error.payload';
import { counterpartyModuleName } from '../const/counterparty.module.name';

export class CurrencyPairNotFoundException extends NotFoundException {
  constructor() {
    super([
      {
        code: CounterpartyExceptionsCodes.CurrencyPairNotFound,
        description: 'Currency pair not found',
        module: counterpartyModuleName,
      },
    ] as IExceptionMessage);
  }
}