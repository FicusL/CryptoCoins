import { TransactionExceptionsCodes } from './transaction.exceptions.codes';
import { IExceptionMessage } from '../../core/errors/error.payload';
import { WsException } from '@nestjs/websockets';
import { transactionModuleName } from './transaction.module.name';

export namespace TransactionWSExceptions {
  export class UnknownError extends WsException {
    constructor() {
      super([
        {
          code: TransactionExceptionsCodes.UnknownError,
          description: 'Unknown error',
          module: transactionModuleName,
        },
      ] as IExceptionMessage);
    }
  }
}