import { BaseGatewayClient } from '../base.gateway.client';

export abstract class BaseGatewayEventHandler<ClientType extends BaseGatewayClient<any>, ResultType = Promise<void>> {
  abstract handle(clients: ClientType[], ...args: any[]): ResultType;
}