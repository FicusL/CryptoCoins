import { BadRequestException } from '@nestjs/common';
import { CounterpartyExceptionsCodes } from '../const/counterparty.exceptions-codes.enum';
import { IExceptionMessage } from '../../core/errors/error.payload';
import { counterpartyModuleName } from '../const/counterparty.module.name';

export class IncorrectHeadersExceptions extends BadRequestException {
  constructor() {
    super([
      {
        code: CounterpartyExceptionsCodes.IncorrectHeaders,
        description: 'Incorrect headers',
        module: counterpartyModuleName,
      },
    ] as IExceptionMessage);
  }
}