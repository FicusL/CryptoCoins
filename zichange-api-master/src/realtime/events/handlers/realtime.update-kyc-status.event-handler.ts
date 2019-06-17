import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { KycUpdateKycStatusEvent } from '../../../kyc/events/impl/kyc.update-kyc-status.event';
import { RealtimeClientGateway } from '../../gateway/realtime.client.gateway';
import { RealtimeAdminGateway } from '../../gateway/realtime.admin.gateway';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { ConfigsService } from '../../../core/service/configs.service';
import { RealtimeMessagesPatterns } from '../../const/realtime.messages-patterns.enum';
import { Logger } from '@nestjs/common';
import { RealtimeMicroservicesUpdateKycStatusDTO } from '../../dto/microservices/realtime.microservices.update-kyc-status.dto';
import { getMicroservicesClientOptions } from '../../../core/util/get-microservices-client-options';

@EventsHandler(KycUpdateKycStatusEvent)
export class RealtimeUpdateKycStatusEventHandler implements IEventHandler<KycUpdateKycStatusEvent> {
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

  async handle(event: KycUpdateKycStatusEvent) {
    if (ConfigsService.useRedis) {
      try {
        const dto = new RealtimeMicroservicesUpdateKycStatusDTO({
          accountId: event.account.id,
          kycId: event.kyc.id,
        });

        await this.client.send(RealtimeMessagesPatterns.UpdateKycStatus, dto).toPromise();
      } catch (e) {
        Logger.error(e.message, undefined, RealtimeUpdateKycStatusEventHandler.name);
      }
    } else {
      await this.realtimeClientGateway.onUpdateKYCStatus(event.account, event.kyc);
      await this.realtimeAdminGateway.onUpdateKYCStatus(event.kyc);
    }
  }
}