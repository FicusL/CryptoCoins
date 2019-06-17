import { BadRequestException } from '@nestjs/common';
import { CounterpartyExceptionsCodes } from '../const/counterparty.exceptions-codes.enum';
import { IExceptionMessage } from '../../core/errors/error.payload';
import { counterpartyModuleName } from '../const/counterparty.module.name';

export class IncorrectSignatureException extends BadRequestException {
  constructor() {
    super([
      {
        code: CounterpartyExceptionsCodes.IncorrectSignature,
        description: 'Incorrect signature',
        module: counterpartyModuleName,
      },
    ] as IExceptionMessage);
  }
}