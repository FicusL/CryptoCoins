import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { BaseGatewayClient } from './base.gateway.client';
import * as SocketIO from 'socket.io';

export abstract class BaseGateway<ClientType extends BaseGatewayClient<any>, SocketType = SocketIO.Socket>
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly socketToClient = new Map<SocketType, ClientType>();

  protected getClientBySocket(socket: SocketType): ClientType | undefined {
    return this.socketToClient.get(socket);
  }

  protected get clients(): ClientType[] {
    return Array.from(this.socketToClient.values());
  }

  protected abstract async createClient(socket: SocketType): Promise<ClientType | undefined>;
  protected async destroyClient(socket) { }

  protected async onClientReady(client) { }

  async handleConnection(socket: SocketType) {
    const client = await this.createClient(socket);
    if (client) {
      this.socketToClient.set(socket, client);
      await this.onClientReady(client);
    }
  }

  async handleDisconnect(socket: SocketType) {
    await this.destroyClient(socket);
    this.socketToClient.delete(socket);
  }
}