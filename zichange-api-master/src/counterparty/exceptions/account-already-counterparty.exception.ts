import { BadRequestException } from '@nestjs/common';
import { CounterpartyExceptionsCodes } from '../const/counterparty.exceptions-codes.enum';
import { IExceptionMessage } from '../../core/errors/error.payload';
import { counterpartyModuleName } from '../const/counterparty.module.name';

export class AccountAlreadyCounterpartyException extends BadRequestException {
  constructor() {
    super([
      {
        code: CounterpartyExceptionsCodes.AccountAlreadyCounterparty,
        description: 'Account already counterparty',
        module: counterpartyModuleName,
      },
    ] as IExceptionMessage);
  }
}