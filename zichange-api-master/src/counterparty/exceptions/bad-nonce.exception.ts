import { BadRequestException } from '@nestjs/common';
import { CounterpartyExceptionsCodes } from '../const/counterparty.exceptions-codes.enum';
import { IExceptionMessage } from '../../core/errors/error.payload';
import { counterpartyModuleName } from '../const/counterparty.module.name';

export class BadNonceException extends BadRequestException {
  constructor() {
    super([
      {
        code: CounterpartyExceptionsCodes.BadNonce,
        description: 'Bad nonce',
        module: counterpartyModuleName,
      },
    ] as IExceptionMessage);
  }
}