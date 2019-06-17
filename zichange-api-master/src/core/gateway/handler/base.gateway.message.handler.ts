import { BaseGatewayClient } from '../base.gateway.client';

export abstract class BaseGatewayMessageHandler<ClientType extends BaseGatewayClient<any>, ResultType = Promise<any>> {
  abstract handle(client: ClientType, ...args: any[]): ResultType;
}
