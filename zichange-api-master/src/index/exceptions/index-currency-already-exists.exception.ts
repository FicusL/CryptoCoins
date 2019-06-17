import { BadRequestException } from '@nestjs/common';
import { IndexExceptionCodes } from '../const/index.exception-codes.enum';
import { IExceptionMessage } from '../../core/errors/error.payload';
import { indexModuleName } from '../const/index.module.name';

export class IndexCurrencyAlreadyExistsException extends BadRequestException {
  constructor() {
    super([
      {
        code: IndexExceptionCodes.IndexCurrencyAlreadyExists,
        description: `Index currency already exists`,
        module: indexModuleName,
      },
    ] as IExceptionMessage);
  }
}