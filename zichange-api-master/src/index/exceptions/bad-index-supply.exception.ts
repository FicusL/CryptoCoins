import { BadRequestException } from '@nestjs/common';
import { IndexExceptionCodes } from '../const/index.exception-codes.enum';
import { IExceptionMessage } from '../../core/errors/error.payload';
import { indexModuleName } from '../const/index.module.name';

export class BadIndexSupplyException extends BadRequestException {
  constructor() {
    super([
      {
        code: IndexExceptionCodes.BadIndexSupply,
        description: `Bad index supply`,
        module: indexModuleName,
      },
    ] as IExceptionMessage);
  }
}