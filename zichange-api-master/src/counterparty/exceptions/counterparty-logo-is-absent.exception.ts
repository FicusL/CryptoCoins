import { NotFoundException } from '@nestjs/common';
import { CounterpartyExceptionsCodes } from '../const/counterparty.exceptions-codes.enum';
import { IExceptionMessage } from '../../core/errors/error.payload';
import { counterpartyModuleName } from '../const/counterparty.module.name';

export class CounterpartyLogoIsAbsentException extends NotFoundException {
  constructor() {
    super([
      {
        code: CounterpartyExceptionsCodes.CounterpartyLogoIsAbsent,
        description: 'Counterparty logo is absent',
        module: counterpartyModuleName,
      },
    ] as IExceptionMessage);
  }
}