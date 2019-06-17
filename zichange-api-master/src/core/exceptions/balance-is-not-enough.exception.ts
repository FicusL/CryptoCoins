import { BadRequestException } from '@nestjs/common';
import { IExceptionMessage } from '../errors/error.payload';
import { CoreExceptionsCodes } from '../const/core.exceptions-codes.enum';
import { coreModuleName } from '../const/core.module.name';

export class BalanceIsNotEnoughException extends BadRequestException {
  constructor() {
    super([
      {
        code: CoreExceptionsCodes.BalanceIsNotEnough,
        description: `Balance is not enough`,
        module: coreModuleName,
      },
    ] as IExceptionMessage);
  }
}