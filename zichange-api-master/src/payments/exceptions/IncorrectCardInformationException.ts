import { BadRequestException } from '@nestjs/common';
import { IExceptionMessage } from '../../core/errors/error.payload';
import { PaymentsExceptionsCodes } from '../const/payments.exceptions-codes.enum';
import { paymentsModuleName } from '../const/paymnets.module.name';

export class IncorrectCardInformationException extends BadRequestException {
  constructor() {
    super([
      {
        code: PaymentsExceptionsCodes.IncorrectCardInformation,
        description: 'Incorrect card information',
        module: paymentsModuleName,
      },
    ] as IExceptionMessage);
  }
}