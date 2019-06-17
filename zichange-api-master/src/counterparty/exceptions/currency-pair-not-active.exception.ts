import { BadRequestException } from '@nestjs/common';
import { CounterpartyExceptionsCodes } from '../const/counterparty.exceptions-codes.enum';
import { IExceptionMessage } from '../../core/errors/error.payload';
import { counterpartyModuleName } from '../const/counterparty.module.name';

export class CurrencyPairNotActiveException extends BadRequestException {
  constructor() {
    super([
      {
        code: CounterpartyExceptionsCodes.CurrencyPairNotActive,
        description: 'Currency pair not active',
        module: counterpartyModuleName,
      },
    ] as IExceptionMessage);
  }
}