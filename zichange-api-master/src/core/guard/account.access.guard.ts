import { IAccountSession } from '../../account/abstract/account.session.interface';
import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
class AccountAccessGuardHttp implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const accountIdField = this.reflector.get<string>('AccountAccessParam', context.getHandler());
    if (!accountIdField) {
      throw new InternalServerErrorException();
    }

    const request = context.switchToHttp().getRequest();

    const accountIdRaw = request.params[accountIdField];
    if (!accountIdRaw) {
      throw new InternalServerErrorException();
    }

    const accountId = parseInt(accountIdRaw, 10);
    if (isNaN(accountId)) {
      throw new BadRequestException();
    }

    const session = request.session as IAccountSession;
    AccountAccessGuard.verifyAccess(accountId, session);
    return true;
  }
}

export class AccountAccessGuard {
  static verifyAccess(accountId: number, session: IAccountSession) {
    if (!session.isActivated || !session.isAuthorized) {
      throw new ForbiddenException();
    }

    if (session.accountId !== accountId && !session.isAdmin) {
      throw new ForbiddenException();
    }
  }

  static Http = AccountAccessGuardHttp;
}