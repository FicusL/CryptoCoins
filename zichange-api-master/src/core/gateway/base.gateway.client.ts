import * as SocketIO from 'socket.io';
import { BaseGateway } from './base.gateway';

export class BaseGatewayClient<GatewayType extends BaseGateway<any>, SocketType = SocketIO.Socket> {
  readonly socket: SocketType;
  readonly gateway: GatewayType;

  constructor(gateway: GatewayType, socket: SocketType) {
    this.gateway = gateway;
    this.socket = socket;
  }
}