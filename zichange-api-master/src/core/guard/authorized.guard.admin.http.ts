import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthorizedGuardHttp } from './authorized.guard.http';

@Injectable()
export class AuthorizedGuardAdminHttp extends AuthorizedGuardHttp implements CanActivate {
  canActivate(context: ExecutionContext) {
    const result = super.canActivate(context);
    if (!result) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const session = request.session;
    return session.isAdmin;
  }
}