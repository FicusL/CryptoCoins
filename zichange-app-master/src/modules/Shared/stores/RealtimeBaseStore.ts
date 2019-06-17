import * as SocketIOClient from 'socket.io-client';
import { EventEmitter } from 'events';
import { injectable } from 'inversify';

@injectable()
export abstract class RealtimeBaseStore {
  protected static socket: SocketIOClient.Socket;
  protected static adminSocket: SocketIOClient.Socket;

  protected readonly eventEmitter = new EventEmitter();

  protected get socket(): SocketIOClient.Socket {
    return RealtimeBaseStore.socket = RealtimeBaseStore.socket ||
      SocketIOClient.connect(window.location.host);
  }

  protected get adminSocket(): SocketIOClient.Socket {
    return RealtimeBaseStore.adminSocket = RealtimeBaseStore.adminSocket ||
      SocketIOClient.connect(window.location.host + '/admin');
  }

  protected static reconnect() {
    this.socket.disconnect();
    this.socket.connect();
  }
}