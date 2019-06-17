import { BadRequestException } from '@nestjs/common';
import { IndexExceptionCodes } from '../const/index.exception-codes.enum';
import { IExceptionMessage } from '../../core/errors/error.payload';
import { indexModuleName } from '../const/index.module.name';

export class IndexCurrencyNotExistsException extends BadRequestException {
  constructor() {
    super([
      {
        code: IndexExceptionCodes.IndexCurrencyNotExists,
        description: `Index currency not exists`,
        module: indexModuleName,
      },
    ] as IExceptionMessage);
  }
}