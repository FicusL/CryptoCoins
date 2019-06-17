import { BadRequestException } from '@nestjs/common';
import { PaymentsExceptionsCodes } from '../const/payments.exceptions-codes.enum';
import { IExceptionMessage } from '../../core/errors/error.payload';
import { paymentsModuleName } from '../const/paymnets.module.name';

export class IncorrectCardExpirationDateException extends BadRequestException {
  constructor() {
    super([
      {
        code: PaymentsExceptionsCodes.IncorrectCardExpirationDate,
        description: 'Incorrect card expiration date',
        module: paymentsModuleName,
      },
    ] as IExceptionMessage);
  }
}