import {SessionGatewayMiddleware} from './session.gateway.middleware';
import {AccountService} from '../service/account.service';
import {IAccountSession} from '../abstract/account.session.interface';
import {Injectable} from '@nestjs/common';

@Injectable()
export class AccountGatewayMiddleware extends SessionGatewayMiddleware {
  constructor(
    private readonly accountService: AccountService,
  ) {
    super();
  }

  resolve(): (socket, next) => Promise<void> {
    return async (socket, next) => {
      await this.attachSessionToSocket(socket);
      const session = socket.handshake.session as IAccountSession;
      socket.account = await this.accountService.getAccountById(session.accountId);
      next();
    };
  }
}