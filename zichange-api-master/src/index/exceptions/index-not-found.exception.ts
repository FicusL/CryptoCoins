import { NotFoundException } from '@nestjs/common';
import { IndexExceptionCodes } from '../const/index.exception-codes.enum';
import { IExceptionMessage } from '../../core/errors/error.payload';
import { indexModuleName } from '../const/index.module.name';

export class IndexNotFoundException extends NotFoundException {
  constructor() {
    super([
      {
        code: IndexExceptionCodes.IndexNotFound,
        description: `Index not found`,
        module: indexModuleName,
      },
    ] as IExceptionMessage);
  }
}