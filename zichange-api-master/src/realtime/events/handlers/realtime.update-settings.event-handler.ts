import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RealtimeAdminGateway } from '../../gateway/realtime.admin.gateway';
import { SettingsUpdateSettingsEvent } from '../../../settings/events/impl/settings.update-settings.event';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { ConfigsService } from '../../../core/service/configs.service';
import { RealtimeMessagesPatterns } from '../../const/realtime.messages-patterns.enum';
import { Logger } from '@nestjs/common';
import { RealtimeMicroservicesUpdateSettingsDTO } from '../../dto/microservices/realtime.microservices.update-settings.dto';
import { getMicroservicesClientOptions } from '../../../core/util/get-microservices-client-options';

@EventsHandler(SettingsUpdateSettingsEvent)
export class RealtimeUpdateSettingsEventHandler implements IEventHandler<SettingsUpdateSettingsEvent> {
  client: ClientProxy;

  constructor(
    private readonly realtimeAdminGateway: RealtimeAdminGateway,
  ) {
    if (!ConfigsService.useRedis) {
      return;
    }

    this.client = ClientProxyFactory.create(getMicroservicesClientOptions());
  }

  async handle(event: SettingsUpdateSettingsEvent) {
    if (ConfigsService.useRedis) {
      try {
        const dto = new RealtimeMicroservicesUpdateSettingsDTO({
          params: event.params,
        });

        await this.client.send(RealtimeMessagesPatterns.UpdateSettings, dto).toPromise();
      } catch (e) {
        Logger.error(e.message, undefined, RealtimeUpdateSettingsEventHandler.name);
      }
    } else {
      await this.realtimeAdminGateway.onUpdateSettings(event.params);
    }
  }
}