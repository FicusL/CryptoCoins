import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RealtimeAdminGateway } from '../../gateway/realtime.admin.gateway';
import { AccountCreateAccountEvent } from '../../../account/events/impl/account.create-account.event';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { ConfigsService } from '../../../core/service/configs.service';
import { RealtimeMessagesPatterns } from '../../const/realtime.messages-patterns.enum';
import { Logger } from '@nestjs/common';
import { RealtimeMicroservicesCreateAccountDTO } from '../../dto/microservices/realtime.microservices.create-account.dto';
import { getMicroservicesClientOptions } from '../../../core/util/get-microservices-client-options';

@EventsHandler(AccountCreateAccountEvent)
export class RealtimeCreateAccountEventHandler implements IEventHandler<AccountCreateAccountEvent> {
  client: ClientProxy;

  constructor(
    private readonly realtimeAdminGateway: RealtimeAdminGateway,
  ) {
    if (!ConfigsService.useRedis) {
      return;
    }

    this.client = ClientProxyFactory.create(getMicroservicesClientOptions());
  }

  async handle(event: AccountCreateAccountEvent) {
    if (ConfigsService.useRedis) {
      try {
        const dto = new RealtimeMicroservicesCreateAccountDTO({
          accountId: event.account.id,
        });

        await this.client.send(RealtimeMessagesPatterns.CreateAccount, dto).toPromise();
      } catch (e) {
        Logger.error(e.message, undefined, RealtimeCreateAccountEventHandler.name);
      }
    } else {
      await this.realtimeAdminGateway.onCreateUser(event.account);
    }
  }
}