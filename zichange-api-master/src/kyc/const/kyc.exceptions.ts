import { BadRequestException, ForbiddenException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { IExceptionMessage } from '../../core/errors/error.payload';
import { kycModuleName } from './kyc.module.name';

enum KycExceptionsCodes {
  UnknownError                = 50000,
  AccountNotFound             = 50001,
  KycAlreadySent              = 50002,
  IncorrectGender             = 50003,
  BadFiles                    = 50004,
  // AccountNotNatural           = 50005, // deprecated
  KYCNotFound                 = 50006,
  NaturalKYCNotFound          = 50007,
  LegalKYCNotFound            = 50008,
  AccountTypeNotMatchEndpoint = 50009,
  MaximumPhotoSizeExceeded    = 50010,
  KycNotExistsInSumSub        = 50011,
  KYCFileNotExists            = 50012,
  PhoneNotFound               = 50013,
  SelfieMustBeSent            = 50014,
  DocumentFrontMustBeSent     = 50015,
  DocumentBackMustBeSent      = 50016,
  ForbiddenSend               = 50017,
}

export namespace KycExceptions {
  export class AccountNotFound extends NotFoundException {
    constructor() {
      super([
        {
          code: KycExceptionsCodes.AccountNotFound,
          description: 'Account not found',
          module: kycModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class KycAlreadySent extends ForbiddenException {
    constructor() {
      super([
        {
          code: KycExceptionsCodes.KycAlreadySent,
          description: 'KYC already sent',
          module: kycModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class IncorrectGender extends BadRequestException {
    constructor() {
      super([
        {
          code: KycExceptionsCodes.IncorrectGender,
          description: 'Incorrect gender',
          module: kycModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class BadFiles extends BadRequestException {
    constructor() {
      super([
        {
          code: KycExceptionsCodes.BadFiles,
          description: 'Bad files',
          module: kycModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class UnknownError extends InternalServerErrorException {
    constructor() {
      super([
        {
          code: KycExceptionsCodes.UnknownError,
          description: 'Unknown error',
          module: kycModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class KYCNotFound extends NotFoundException {
    constructor() {
      super([
        {
          code: KycExceptionsCodes.KYCNotFound,
          description: 'KYC not found',
          module: kycModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class NaturalKYCNotFound extends NotFoundException {
    constructor() {
      super([
        {
          code: KycExceptionsCodes.NaturalKYCNotFound,
          description: 'Natural KYC not found',
          module: kycModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class LegalKYCNotFound extends NotFoundException {
    constructor() {
      super([
        {
          code: KycExceptionsCodes.LegalKYCNotFound,
          description: 'Legal KYC not found',
          module: kycModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class AccountTypeNotMatchEndpoint extends ForbiddenException {
    constructor() {
      super([
        {
          code: KycExceptionsCodes.AccountTypeNotMatchEndpoint,
          description: 'Account type not match endpoint',
          module: kycModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class MaximumPhotoSizeExceeded extends BadRequestException {
    constructor(fileName: string, maxSizeMb: number) {
      super([
        {
          code: KycExceptionsCodes.MaximumPhotoSizeExceeded,
          description: `Maximum photo size exceeded. Photo: ${fileName}. Max file size: ${maxSizeMb} Mb`,
          module: kycModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class KycNotExistsInSumSub extends BadRequestException {
    constructor() {
      super([
        {
          code: KycExceptionsCodes.KycNotExistsInSumSub,
          description: 'Kyc not exists in SumSub',
          module: kycModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class KYCFileNotExists extends NotFoundException {
    constructor() {
      super([
        {
          code: KycExceptionsCodes.KYCFileNotExists,
          description: 'KYC file not exists',
          module: kycModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class PhoneNotFound extends NotFoundException {
    constructor() {
      super([
        {
          code: KycExceptionsCodes.PhoneNotFound,
          description: 'Phone not found',
          module: kycModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class FilesMustBeSent extends BadRequestException {
    constructor(files: ('selfie' | 'documentFront' | 'documentBack')[]) {
      const errors: IExceptionMessage = [];

      if (files.includes('selfie')) {
        errors.push({
          code: KycExceptionsCodes.SelfieMustBeSent,
          description: 'Selfie must be sent',
          module: kycModuleName,
        });
      }

      if (files.includes('documentFront')) {
        errors.push({
          code: KycExceptionsCodes.DocumentFrontMustBeSent,
          description: 'Front side of identity document must be sent',
          module: kycModuleName,
        });
      }

      if (files.includes('documentBack')) {
        errors.push({
          code: KycExceptionsCodes.DocumentBackMustBeSent,
          description: 'Back side of identity document must be sent',
          module: kycModuleName,
        });
      }

      super(errors);
    }
  }
  export class ForbiddenSend extends ForbiddenException {
    constructor() {
      super([
        {
          code: KycExceptionsCodes.ForbiddenSend,
          description: 'Forbidden send',
          module: kycModuleName,
        },
      ] as IExceptionMessage);
    }
  }
}