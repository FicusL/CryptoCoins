import { BaseGatewayClient } from '../../core/gateway/base.gateway.client';
import { IAccountSession } from '../../account/abstract/account.session.interface';
import { RealtimeAdminGateway } from '../gateway/realtime.admin.gateway';

export class RealtimeAdminGatewayClient extends BaseGatewayClient<RealtimeAdminGateway> {
  isAdmin: boolean;
  isTrader: boolean;
  isAmlOfficer: boolean;

  constructor(gateway: RealtimeAdminGateway, socket: SocketIO.Socket, session: IAccountSession) {
    super(gateway, socket);

    this.isAdmin = session.isAdmin;
    this.isTrader = session.isTrader;
    this.isAmlOfficer = session.isAmlOfficer;
  }
}
