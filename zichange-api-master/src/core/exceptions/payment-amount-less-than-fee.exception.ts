import { IExceptionMessage } from '../errors/error.payload';
import { BadRequestException } from '@nestjs/common';
import { CoreExceptionsCodes } from '../const/core.exceptions-codes.enum';
import { coreModuleName } from '../const/core.module.name';

export class PaymentAmountLessThanFee extends BadRequestException {
  constructor() {
    super([
      {
        code: CoreExceptionsCodes.PaymentAmountLessThanFee,
        description: `Payment amount less than fee`,
        module: coreModuleName,
      },
    ] as IExceptionMessage);
  }
}