import { BadRequestException } from '@nestjs/common';
import { IndexExceptionCodes } from '../const/index.exception-codes.enum';
import { IExceptionMessage } from '../../core/errors/error.payload';
import { indexModuleName } from '../const/index.module.name';

export class IndexUsedInTransactionsException extends BadRequestException {
  constructor() {
    super([
      {
        code: IndexExceptionCodes.IndexUsedInTransactions,
        description: `Index used in transactions`,
        module: indexModuleName,
      },
    ] as IExceptionMessage);
  }
}