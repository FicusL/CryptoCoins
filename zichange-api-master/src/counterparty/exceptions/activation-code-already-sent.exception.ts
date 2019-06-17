import { BadRequestException } from '@nestjs/common';
import { CounterpartyExceptionsCodes } from '../const/counterparty.exceptions-codes.enum';
import { IExceptionMessage } from '../../core/errors/error.payload';
import { counterpartyModuleName } from '../const/counterparty.module.name';

export class ActivationCodeAlreadySentException extends BadRequestException {
  constructor() {
    super([
      {
        code: CounterpartyExceptionsCodes.ActivationCodeAlreadySent,
        description: 'Activation code already sent',
        module: counterpartyModuleName,
      },
    ] as IExceptionMessage);
  }
}