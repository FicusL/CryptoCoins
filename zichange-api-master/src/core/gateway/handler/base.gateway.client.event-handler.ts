import { BaseGatewayClient } from '../base.gateway.client';

export abstract class BaseGatewayClientEventHandler<ClientType extends BaseGatewayClient<any>, ResultType = Promise<void>> {
  abstract handle(client: ClientType, ...args: any[]): ResultType;
}