import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthorizedGuardHttp } from './authorized.guard.http';
import { IAccountSession } from '../../account/abstract/account.session.interface';

@Injectable()
export class AuthorizedGuardCounterpartyHttp extends AuthorizedGuardHttp implements CanActivate {
  canActivate(context: ExecutionContext) {
    const result = super.canActivate(context);
    if (!result) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const session: IAccountSession = request.session;
    return session.isCounterparty || session.isAdmin;
  }
}