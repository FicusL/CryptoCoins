import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { KycAddKycEvent } from '../../../kyc/events/impl/kyc.add-kyc.event';
import { RealtimeClientGateway } from '../../gateway/realtime.client.gateway';
import { RealtimeAdminGateway } from '../../gateway/realtime.admin.gateway';
import { ConfigsService } from '../../../core/service/configs.service';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { RealtimeMicroservicesAddKycDTO } from '../../dto/microservices/realtime.microservices.add-kyc.dto';
import { RealtimeMessagesPatterns } from '../../const/realtime.messages-patterns.enum';
import { getMicroservicesClientOptions } from '../../../core/util/get-microservices-client-options';

@EventsHandler(KycAddKycEvent)
export class RealtimeAddKycEventHandler implements IEventHandler<KycAddKycEvent> {
  client: ClientProxy;

  constructor(
    private readonly realtimeClientGateway: RealtimeClientGateway,
    private readonly realtimeAdminGateway: RealtimeAdminGateway,
  ) {
    if (!ConfigsService.useRedis) {
      return;
    }

    this.client = ClientProxyFactory.create(getMicroservicesClientOptions());
  }

  async handle(event: KycAddKycEvent) {
    if (ConfigsService.useRedis) {
      try {
        const dto = new RealtimeMicroservicesAddKycDTO({
          accountId: event.account.id,
          kycId: event.kyc.id,
        });

        await this.client.send(RealtimeMessagesPatterns.AddKyc, dto).toPromise();
      } catch (e) {
        Logger.error(e.message, undefined, RealtimeAddKycEventHandler.name);
      }
    } else {
      await this.realtimeClientGateway.onAddKYC(event.account, event.kyc);
      await this.realtimeAdminGateway.onAddKYC(event.kyc);
    }
  }
}