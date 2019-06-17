import { Injectable } from '@nestjs/common';
import { GatewayMiddleware } from '@nestjs/websockets'; // TODO: deprecated. Must delete later
import { getSessionMiddleware } from '../../core/session/session.middleware';
import { Response } from 'express';

// Puts session to socket.handshake.session
@Injectable()
export class SessionGatewayMiddleware implements GatewayMiddleware {
  resolve() {
    return (socket, next) => {
      this.attachSessionToSocket(socket).then(() => next());
    };
  }

  protected async attachSessionToSocket(socket): Promise<void> {
    await SessionGatewayMiddleware.getSessionBySocket(socket);
    socket.session = socket.handshake.session;
  }

  static async getSessionBySocket(socket): Promise<object> {
    return new Promise(resolve => {
      const sessionMiddleware = getSessionMiddleware();
      sessionMiddleware(socket.handshake, {} as Response,
        () => resolve(socket.handshake.session));
    });
  }
}
