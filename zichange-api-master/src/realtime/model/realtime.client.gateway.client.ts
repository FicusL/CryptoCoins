import { TransactionSortBy } from '../const/transaction/transaction.sort.by.enum';
import { TransactionSortDirection } from '../const/transaction/transaction.sort.direction.enum';
import { BaseGatewayClient } from '../../core/gateway/base.gateway.client';
import { RealtimeClientGateway } from '../gateway/realtime.client.gateway';
import { IAccountSession } from '../../account/abstract/account.session.interface';

export class RealtimeClientGatewayClient extends BaseGatewayClient<RealtimeClientGateway> {
  accountId: number;
  isAuthorized: boolean;
  isActivated: boolean;
  isAdmin: boolean;

  sort: {
    by: TransactionSortBy,
    direction: TransactionSortDirection,
  };

  amount: number;

  constructor(gateway: RealtimeClientGateway, socket: SocketIO.Socket, session: IAccountSession) {
    super(gateway, socket);

    this.accountId = session.accountId || -1;
    this.isActivated = session.isActivated || false;
    this.isAuthorized = session.isAuthorized || false;
    this.isAdmin = session.isAdmin || false;

    this.amount = 0;
    this.sort = {
      by: TransactionSortBy.date,
      direction: TransactionSortDirection.DESC,
    };
  }
}
