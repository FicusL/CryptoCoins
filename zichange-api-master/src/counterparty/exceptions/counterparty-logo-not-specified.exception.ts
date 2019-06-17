import { BadRequestException } from '@nestjs/common';
import { CounterpartyExceptionsCodes } from '../const/counterparty.exceptions-codes.enum';
import { IExceptionMessage } from '../../core/errors/error.payload';
import { counterpartyModuleName } from '../const/counterparty.module.name';

export class CounterpartyLogoNotSpecifiedException extends BadRequestException {
  constructor() {
    super([
      {
        code: CounterpartyExceptionsCodes.CounterpartyLogoNotSpecified,
        description: 'Counterparty logo not specified',
        module: counterpartyModuleName,
      },
    ] as IExceptionMessage);
  }
}