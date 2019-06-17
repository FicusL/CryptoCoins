import { NotFoundException } from '@nestjs/common';
import { IExceptionMessage } from '../errors/error.payload';
import { CoreExceptionsCodes } from '../const/core.exceptions-codes.enum';
import { coreModuleName } from '../const/core.module.name';

export class NotFoundCurrencyException extends NotFoundException {
  constructor(currency: string) {
    super([
      {
        code: CoreExceptionsCodes.NotFoundCurrency,
        description: `Not found currency: ${currency}`,
        module: coreModuleName,
      },
    ] as IExceptionMessage);
  }
}