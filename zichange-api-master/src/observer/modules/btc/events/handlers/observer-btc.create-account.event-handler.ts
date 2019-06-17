import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OutObserverBtcAddAddressForObserveDTO } from '../../dto/out.observer-btc.add-address-for-observe.dto';
import { ObserverBtcMessagesFromMasterEnum } from '../../const/observer-btc.messages-from-master.enum';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { AccountCreatedBtcWalletEvent } from '../../../../../account/events/impl/account.created-btc-wallet.event';
import { ConfigsService } from '../../../../../core/service/configs.service';
import { getMicroservicesClientOptions } from '../../../../../core/util/get-microservices-client-options';

@EventsHandler(AccountCreatedBtcWalletEvent)
export class ObserverBtcCreateAccountEventHandler implements IEventHandler<AccountCreatedBtcWalletEvent> {
  client: ClientProxy;

  constructor() {
    if (!ConfigsService.useRedis) {
      return;
    }

    this.client = ClientProxyFactory.create(getMicroservicesClientOptions());
  }

  async handle(event: AccountCreatedBtcWalletEvent) {
    if (!ConfigsService.useRedis) {
      return;
    }

    try {
      const dto = new OutObserverBtcAddAddressForObserveDTO(event.walletAddress);
      await this.client.send(ObserverBtcMessagesFromMasterEnum.AddNewAddressForObserve, dto).toPromise();
    } catch (e) {
      Logger.error(e.message, undefined, ObserverBtcCreateAccountEventHandler.name);
    }
  }
}