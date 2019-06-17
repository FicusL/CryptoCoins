import {AccountGatewayMiddleware} from './account.gateway.middleware';
import {SessionGatewayMiddleware} from './session.gateway.middleware';

export const accountMiddlewares = [
  SessionGatewayMiddleware,
  AccountGatewayMiddleware,
];