import { NotFoundException } from '@nestjs/common';
import { IExceptionMessage } from '../../core/errors/error.payload';
import { requisiteModuleName } from './requisite.module.name';

enum BankAccountExceptionsCodes {
  BankAccountFound       = 20001,
  AccountNotFound        = 20002,
}

export namespace BankAccountExceptions {
  export class BankAccountNotFound extends NotFoundException {
    constructor() {
      super([
        {
          code: BankAccountExceptionsCodes.BankAccountFound,
          description: 'Bank account not found',
          module: requisiteModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class AccountNotFound extends NotFoundException {
    constructor() {
      super([
        {
          code: BankAccountExceptionsCodes.AccountNotFound,
          description: 'Account not found',
          module: requisiteModuleName,
        },
      ] as IExceptionMessage);
    }
  }
}