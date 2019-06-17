import { BaseGateway } from '../../core/gateway/base.gateway';
import { IAccountSession } from '../../account/abstract/account.session.interface';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { SessionGatewayMiddleware } from '../../account/middleware/session.gateway.middleware';
import { RealtimeAdminGatewayClient } from '../model/realtime.admin.gateway.client';
import { RealtimeTransactionAdminMessages } from '../const/realtime.admin.messages.enum';
import { AccountEntity } from '../../account/entitiy/account.entity';
import { KycEntity } from '../../kyc/entity/kyc.entity';
import { RealtimeGetKycInfoAdminMessageHandler } from '../message-handler/admin/realtime.get-kyc-info.admin-message-handler';
import { InAdminGetKycDto } from '../dto/admin/in.admin.get-kyc.dto';
import { TransactionEntity } from '../../transaction/entity/transaction.entity';
import { OutAdminTransactionDto } from '../../transaction/dto/out.admin.transaction.dto';
import { OutKycDto } from '../../kyc/dto/out.kyc.dto';
import { OutUpdateSettingsDTO } from '../dto/admin/out.update-settings.dto';
import { SettingKeyDtoType } from '../../settings/abstract/setting.key-dto.type';
import { OutAccountShortDto } from '../../account/dto/out.account.short.dto';
import { OutKycStatusDto } from '../../kyc/dto/out.kyc.status.dto';

@WebSocketGateway({ namespace: '/admin', middleware: [SessionGatewayMiddleware] })
export class RealtimeAdminGateway extends BaseGateway<RealtimeAdminGatewayClient> {
  constructor(
    private readonly realtimeGetKycInfoAdminMessageHandler: RealtimeGetKycInfoAdminMessageHandler,
  ) {
    super();
  }

  protected async createClient(socket: SocketIO.Socket): Promise<RealtimeAdminGatewayClient | undefined> {
    const session: IAccountSession = (socket.handshake as any).session;
    if (!session) {
      return undefined;
    }

    if (!session.isAdmin && !session.isTrader && !session.isAmlOfficer) {
      return undefined;
    }

    return new RealtimeAdminGatewayClient(this, socket, session);
  }

  async onCreateUser(entity: AccountEntity) {
    const clients = this.clients.filter(cl => cl.isAdmin || cl.isTrader);

    const accountBalance = [];
    const dto = new OutAccountShortDto(entity, accountBalance);

    const sockets = clients.map((client) => client.socket);
    sockets.map((socket) => socket.emit(RealtimeTransactionAdminMessages.CreateUser, dto));
  }

  async onUpdateSettings(params: SettingKeyDtoType) {
    const clients = this.clients.filter(cl => cl.isAdmin || cl.isTrader);
    const sockets = clients.map((client) => client.socket);

    const dto = new OutUpdateSettingsDTO(params);

    sockets.map((socket) => socket.emit(RealtimeTransactionAdminMessages.UpdateSettings, dto));
  }

  async onUpdateKYCStatus(entity: KycEntity) {
    const clients = this.clients.filter(cl => cl.isAdmin || cl.isTrader || cl.isAmlOfficer);

    const sockets = clients.map((client) => client.socket);
    const dto = new OutKycStatusDto(entity);
    sockets.map((socket) => socket.emit(RealtimeTransactionAdminMessages.UpdateKYCStatus, dto));
  }

  async onAddKYC(entity: KycEntity) {
    const clients = this.clients.filter(cl => cl.isAdmin || cl.isTrader || cl.isAmlOfficer);

    const sockets = clients.map((client) => client.socket);
    const dto = new OutKycDto(entity);
    sockets.map((socket) => socket.emit(RealtimeTransactionAdminMessages.AddKYC, dto));
  }

  async onAddTransaction(entity: TransactionEntity) {
    const dto = new OutAdminTransactionDto(entity);
    const clients = this.clients.filter(cl => cl.isAdmin || cl.isTrader);

    const sockets = clients.map((client) => client.socket);
    sockets.map((socket) => socket.emit(RealtimeTransactionAdminMessages.AddTransaction, dto));
  }

  protected async onUpdateTransaction(entity: TransactionEntity) {
    const dto = new OutAdminTransactionDto(entity);
    const clients = this.clients.filter(cl => cl.isAdmin || cl.isTrader);

    const sockets = clients.map((client) => client.socket);
    sockets.map((socket) => socket.emit(RealtimeTransactionAdminMessages.UpdateTransaction, dto));
  }

  // @UsePipes(new ValidationPipe()) // TODO: add validation for DTO
  @SubscribeMessage(RealtimeTransactionAdminMessages.GetKycInfo)
  protected async onGetKycInfo(socket, payload: InAdminGetKycDto) {
    const client = this.getClientBySocket(socket);
    if (!client) {
      return;
    }

    const hasAccess = client.isAdmin || client.isAmlOfficer;
    if (!hasAccess) {
      return;
    }

    await this.realtimeGetKycInfoAdminMessageHandler.handle(client, payload);
  }
}