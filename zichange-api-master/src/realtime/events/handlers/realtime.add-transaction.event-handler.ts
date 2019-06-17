import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RealtimeAdminGateway } from '../../gateway/realtime.admin.gateway';
import { TransactionAddTransactionEvent } from '../../../transaction/events/impl/transaction.add-transaction.event';
import { RealtimeClientGateway } from '../../gateway/realtime.client.gateway';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { ConfigsService } from '../../../core/service/configs.service';
import { RealtimeMessagesPatterns } from '../../const/realtime.messages-patterns.enum';
import { Logger } from '@nestjs/common';
import { RealtimeMicroservicesAddTransactionDTO } from '../../dto/microservices/realtime.microservices.add-transaction.dto';
import { getMicroservicesClientOptions } from '../../../core/util/get-microservices-client-options';

@EventsHandler(TransactionAddTransactionEvent)
export class RealtimeAddTransactionEventHandler implements IEventHandler<TransactionAddTransactionEvent> {
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

  async handle(event: TransactionAddTransactionEvent) {
    if (ConfigsService.useRedis && event.pushToRedis) {
      try {
        const dto = new RealtimeMicroservicesAddTransactionDTO({
          accountId: event.account.id,
          transactionReferenceId: event.transaction.referenceId,
        });
        await this.client.send(RealtimeMessagesPatterns.AddTransaction, dto).toPromise();
      } catch (e) {
        Logger.error(e.message, undefined, RealtimeAddTransactionEventHandler.name);
      }
    } else {
      await this.realtimeAdminGateway.onAddTransaction(event.transaction);
      await this.realtimeClientGateway.onTransactionAdd(event.account, event.transaction);
    }
  }
}