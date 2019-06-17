import { InternalServerErrorException } from '@nestjs/common';
import { CounterpartyExceptionsCodes } from '../const/counterparty.exceptions-codes.enum';
import { IExceptionMessage } from '../../core/errors/error.payload';
import { counterpartyModuleName } from '../const/counterparty.module.name';

export class CanNotDefineTransactionStepException extends InternalServerErrorException {
  constructor() {
    super([
      {
        code: CounterpartyExceptionsCodes.CanNotDefineTransactionStep,
        description: 'Can not define transaction step',
        module: counterpartyModuleName,
      },
    ] as IExceptionMessage);
  }
}