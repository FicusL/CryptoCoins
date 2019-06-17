import { BadRequestException } from '@nestjs/common';
import { CounterpartyExceptionsCodes } from '../const/counterparty.exceptions-codes.enum';
import { IExceptionMessage } from '../../core/errors/error.payload';
import { counterpartyModuleName } from '../const/counterparty.module.name';

export class UnknownCurrencyException extends BadRequestException {
  constructor(currency: string) {
    super([
      {
        code: CounterpartyExceptionsCodes.UnknownCurrency,
        description: `Unknown currency: ${currency}`,
        module: counterpartyModuleName,
      },
    ] as IExceptionMessage);
  }
}