import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { SessionGatewayMiddleware } from '../../account/middleware/session.gateway.middleware';
import { InGetTransactionsDTO } from '../dto/in.get-transactions.dto';
import { RealtimeTransactionClientMessages } from '../const/realtime.client.messages.enum';
import { BaseGateway } from '../../core/gateway/base.gateway';
import { RealtimeTransactionRequestClientMessageHandler } from '../message-handler/client/realtime.transaction-request.client-message-handler';
import { OutGetTransactionsDTO } from '../dto/out.get-transactions.dto';
import { RealtimeClientGatewayClient } from '../model/realtime.client.gateway.client';
import { IAccountSession } from '../../account/abstract/account.session.interface';
import { AccountEntity } from '../../account/entitiy/account.entity';
import { KycEntity } from '../../kyc/entity/kyc.entity';
import { TransactionEntity } from '../../transaction/entity/transaction.entity';
import { OutKycDto } from '../../kyc/dto/out.kyc.dto';
import { RealtimeExchangeRateMessages } from '../const/realtime.exchange-rate.messages.enum';
import { IRates } from '../abstract/realtime.rates.interface';
import { OutTransactionDTO } from '../../transaction/dto/transaction/out.transaction.dto';
import { OutKycStatusDto } from '../../kyc/dto/out.kyc.status.dto';
import { RatesServiceProviderBase } from '../../rates/service/rates.service.provider.base';

@WebSocketGateway({ middleware: [SessionGatewayMiddleware] })
export class RealtimeClientGateway extends BaseGateway<RealtimeClientGatewayClient> {
  constructor(
    private readonly exchangeService: RatesServiceProviderBase,

    private readonly transactionRequestMessageHandler: RealtimeTransactionRequestClientMessageHandler,
  ) {
    super();
  }

  readonly accountIdToClients = new Map<number, RealtimeClientGatewayClient[]>();

  protected async createClient(socket: SocketIO.Socket): Promise<RealtimeClientGatewayClient | undefined> {
    const session: IAccountSession = (socket.handshake as any).session;
    if (!session || !session.accountId) {
      return undefined;
    }

    const client = new RealtimeClientGatewayClient(this, socket, session);

    if (!this.accountIdToClients.has(client.accountId)) {
      this.accountIdToClients.set(client.accountId, []);
    }

    // @ts-ignore
    this.accountIdToClients.get(client.accountId).push(client);
    return client;
  }

  protected async destroyClient(socket: SocketIO.Socket): Promise<any> {
    const client = this.getClientBySocket(socket);
    if (!client) {
      return;
    }

    let clients = this.accountIdToClients.get(client.accountId) || [];
    clients = clients.filter(value => value !== client);

    if (clients.length > 0) {
      this.accountIdToClients.set(client.accountId, clients);
      return;
    }

    // @ts-ignore
    this.accountIdToClients.delete(client.accountId);
  }

  // Not event for real
  protected async onClientReady(client: RealtimeClientGatewayClient) {
    client.socket.emit(RealtimeExchangeRateMessages.Update, this.exchangeService.rates);
  }

  async onTransactionAdd(account: AccountEntity, transaction: TransactionEntity) {
    const clients = this.accountIdToClients.get(account.id) || [];

    const dto = new OutTransactionDTO(transaction);
    clients.map(c => c.socket.emit(RealtimeTransactionClientMessages.AddTransaction, dto));
  }

  protected async onTransactionChange(account: AccountEntity, transaction: TransactionEntity) {
    const clients = this.accountIdToClients.get(account.id) || [];

    const dto = new OutTransactionDTO(transaction);
    clients.map(c => c.socket.emit(RealtimeTransactionClientMessages.UpdateTransaction, dto));
  }

  async onUpdateRates(rates: IRates) {
    const sockets = this.clients.map((client) => client.socket);
    sockets.map((socket) => socket.emit(RealtimeExchangeRateMessages.Update, rates));
  }

  async onUpdateKYCStatus(account: AccountEntity, entity: KycEntity) {
    const clients = this.accountIdToClients.get(account.id) || [];

    const dto = new OutKycStatusDto(entity);
    clients.map(c => c.socket.emit(RealtimeTransactionClientMessages.UpdateKYCStatus, dto));
  }

  async onAddKYC(account: AccountEntity, entity: KycEntity) {
    const clients = this.accountIdToClients.get(account.id) || [];

    const dto = new OutKycDto(entity);
    clients.map(c => c.socket.emit(RealtimeTransactionClientMessages.AddKYC, dto));
  }

  // @UsePipes(new ValidationPipe())
  @SubscribeMessage(RealtimeTransactionClientMessages.GetTransactions)
  protected async onTransactionsRequest(socket, payload: InGetTransactionsDTO) {
    const client = this.getClientBySocket(socket);
    if (!client || !client.isAuthorized) {
      return new OutGetTransactionsDTO([]);
    }

    await this.transactionRequestMessageHandler.handle(client, payload);
  }
}