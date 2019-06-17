import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { LoggedInGuardHttp } from './loggedin.guard.http';

@Injectable()
export class AuthorizedGuardHttp extends LoggedInGuardHttp implements CanActivate {
  canActivate(context: ExecutionContext) {
    const result = super.canActivate(context);
    if (!result) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const session = request.session;

    return session.isAuthorized;
  }
}