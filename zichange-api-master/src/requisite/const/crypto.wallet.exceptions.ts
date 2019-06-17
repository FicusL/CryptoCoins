import { NotFoundException } from '@nestjs/common';
import { IExceptionMessage } from '../../core/errors/error.payload';
import { requisiteModuleName } from './requisite.module.name';

enum CryptoWalletExceptionsCodes {
  WalletNotFound       = 30001,
  AccountNotFound      = 30002,
}

export namespace CryptoWalletExceptions {
  export class WalletNotFound extends NotFoundException {
    constructor() {
      super([
        {
          code: CryptoWalletExceptionsCodes.WalletNotFound,
          description: 'Crypto wallet not found',
          module: requisiteModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class AccountNotFound extends NotFoundException {
    constructor() {
      super([
        {
          code: CryptoWalletExceptionsCodes.AccountNotFound,
          description: 'Account not found',
          module: requisiteModuleName,
        },
      ] as IExceptionMessage);
    }
  }
}