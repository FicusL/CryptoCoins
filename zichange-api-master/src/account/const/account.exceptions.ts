import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { IExceptionMessage } from '../../core/errors/error.payload';
import { accountModuleName } from './account-module.name';

enum AccountExceptionsCodes {
  UnknownErrorCode              = 10000,
  EmailAlreadyRegistered        = 10001,
  EmailNotFound                 = 10002,
  ReferralCodeNotFound          = 10003,
  GenerateWalletsError          = 10004,
  Incorrect2FACode              = 10005,
  AlreadyEnabled2FA             = 10006,
  NotGenerated2FACode           = 10007,
  AlreadyDisabled2FA            = 10008,
  IncorrectPassword             = 10009,
  IncorrectOldPassword          = 10010,
  NoEmailPasswordMatches        = 10011,
  EqualPasswords                = 10012,
  ResetTokenIncorrect           = 10013,
  AccountAlreadyActivated       = 10014,
  ActivationTokenIncorrect      = 10015,
  AccountNotFound               = 10016,
  IncorrectInviteCode           = 10017,
  IncorrectReferralToken        = 10018,
  AccountAlreadyPartner         = 10019,
  AccountMustBePartner          = 10020,
  AccountAlreadyReferral        = 10021,
  PartnerCannotBeHisOwnReferral = 10022,
  IncorrectCounterpartyCode     = 10023,
  AccountIsBlocked              = 10024,
}

export namespace AccountExceptions {
  export class AlreadyEnabled2FA extends ForbiddenException {
    constructor() {
      super([
        {
          code: AccountExceptionsCodes.AlreadyEnabled2FA,
          description: '2FA is already enabled',
          module: accountModuleName,
        },
      ] as IExceptionMessage);
    }
  }

  export class AlreadyDisabled2FA extends ForbiddenException {
    constructor() {
      super([
        {
          code: AccountExceptionsCodes.AlreadyDisabled2FA,
          description: '2FA is already disabled',
          module: accountModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class NotGenerated2FACode extends NotAcceptableException {
    constructor() {
      super([
        {
          code: AccountExceptionsCodes.NotGenerated2FACode,
          description: '2FA isn\'t generated',
          property: 'code',
          module: accountModuleName,
        },
      ] as IExceptionMessage);
    }
  }

  export class IncorrectPassword extends ForbiddenException {
    constructor() {
      super([
        {
          code: AccountExceptionsCodes.IncorrectPassword,
          description: 'Incorrect password',
          property: 'password',
          module: accountModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class IncorrectOldPassword extends ForbiddenException {
    constructor() {
      super([
        {
          code: AccountExceptionsCodes.IncorrectOldPassword,
          description: 'Incorrect password',
          property: 'oldPassword',
          module: accountModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class Incorrect2FACode extends ForbiddenException {
    constructor() {
      super([
        {
          code: AccountExceptionsCodes.Incorrect2FACode,
          description: 'Incorrect 2FA code',
          property: 'code',
          module: accountModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class NoEmailPasswordMatches extends ForbiddenException {
    constructor() {
      super([
        {
          code: AccountExceptionsCodes.NoEmailPasswordMatches,
          description: 'Can\'t find any matches for email/password combination',
          property: 'password',
          module: accountModuleName,
        },
        {
          code: AccountExceptionsCodes.NoEmailPasswordMatches,
          description: 'Can\'t find any matches for email/password combination',
          property: 'email',
          module: accountModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class EmailAlreadyRegistered extends ForbiddenException {
    constructor() {
      super([
        {
          code: AccountExceptionsCodes.EmailAlreadyRegistered,
          description: 'Email already registered',
          property: 'email',
          module: accountModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class GenerateWalletsError extends InternalServerErrorException {
    constructor() {
      super([
        {
          code: AccountExceptionsCodes.GenerateWalletsError,
          description: 'Can\'t generate wallets',
          module: accountModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class EqualPasswords extends UnprocessableEntityException {
    constructor() {
      super([
        {
          code: AccountExceptionsCodes.EqualPasswords,
          description: 'Passwords must not be equal',
          property: 'oldPassword',
          module: accountModuleName,
        },
        {
          code: AccountExceptionsCodes.EqualPasswords,
          description: 'Passwords must not be equal',
          property: 'newPassword',
          module: accountModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class EmailNotFound extends NotFoundException {
    constructor() {
      super([
        {
          code: AccountExceptionsCodes.EmailNotFound,
          description: 'Email isn\'t registered',
          module: accountModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class ResetTokenIncorrect extends NotFoundException {
    constructor() {
      super([
        {
          code: AccountExceptionsCodes.ResetTokenIncorrect,
          description: 'Reset token has been expired or not valid',
          module: accountModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class AccountAlreadyActivated extends ForbiddenException {
    constructor() {
      super([
        {
          code: AccountExceptionsCodes.AccountAlreadyActivated,
          description: 'AccountEntity already activated',
          module: accountModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class ActivationTokenIncorrect extends NotFoundException {
    constructor() {
      super([
        {
          code: AccountExceptionsCodes.ActivationTokenIncorrect,
          description: 'Activation token has been expired or not valid',
          module: accountModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class AccountNotFound extends NotFoundException {
    constructor() {
      super([
        {
          code: AccountExceptionsCodes.AccountNotFound,
          description: 'Account not found',
          module: accountModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class IncorrectInviteCode extends ForbiddenException {
    constructor() {
      super([
        {
          code: AccountExceptionsCodes.IncorrectInviteCode,
          description: 'Incorrect invite code',
          property: 'invite_code',
          module: accountModuleName,
        },
      ] as IExceptionMessage);
    }
  }

  export class IncorrectReferralToken extends ForbiddenException {
    constructor() {
      super([
        {
          code: AccountExceptionsCodes.IncorrectReferralToken,
          description: 'Incorrect referral token',
          module: accountModuleName,
        },
      ] as IExceptionMessage);
    }
  }

  export class AccountAlreadyPartner extends ForbiddenException {
    constructor() {
      super([
        {
          code: AccountExceptionsCodes.AccountAlreadyPartner,
          description: 'Account already partner',
          module: accountModuleName,
        },
      ] as IExceptionMessage);
    }
  }

  export class AccountMustBePartner extends ForbiddenException {
    constructor() {
      super([
        {
          code: AccountExceptionsCodes.AccountMustBePartner,
          description: 'Account must be partner',
          module: accountModuleName,
        },
      ] as IExceptionMessage);
    }
  }

  export class AccountAlreadyReferral extends ForbiddenException {
    constructor() {
      super([
        {
          code: AccountExceptionsCodes.AccountAlreadyReferral,
          description: 'Account already referral',
          module: accountModuleName,
        },
      ] as IExceptionMessage);
    }
  }

  export class PartnerCannotBeHisOwnReferral extends BadRequestException {
    constructor() {
      super([
        {
          code: AccountExceptionsCodes.PartnerCannotBeHisOwnReferral,
          description: 'The partner cannot be his own referral',
          module: accountModuleName,
        },
      ] as IExceptionMessage);
    }
  }

  export class IncorrectCounterpartyCode extends ForbiddenException {
    constructor() {
      super([
        {
          code: AccountExceptionsCodes.IncorrectCounterpartyCode,
          description: 'Code incorrect or expired',
          property: 'code',
          module: accountModuleName,
        },
      ] as IExceptionMessage);
    }
  }

  export class AccountIsBlocked extends ForbiddenException {
    constructor(blockingReason?: string) {
      super([
        {
          code: AccountExceptionsCodes.AccountIsBlocked,
          description: `Account is blocked. Reason: ${blockingReason || ''}`,
          module: accountModuleName,
        },
      ] as IExceptionMessage);
    }
  }
}