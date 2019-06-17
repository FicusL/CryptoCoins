import { BadRequestException } from '@nestjs/common';
import { IndexExceptionCodes } from '../const/index.exception-codes.enum';
import { IExceptionMessage } from '../../core/errors/error.payload';
import { indexModuleName } from '../const/index.module.name';

export class IndexAlreadyExistsException extends BadRequestException {
  constructor() {
    super([
      {
        code: IndexExceptionCodes.IndexAlreadyExists,
        description: `Index already exists`,
        module: indexModuleName,
      },
    ] as IExceptionMessage);
  }
}