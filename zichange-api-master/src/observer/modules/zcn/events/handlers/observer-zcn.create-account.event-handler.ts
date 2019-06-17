import { EventsHandler , IEventHandler} from '@nestjs/cqrs';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { OutObserverZcnAddAddressForObserveDTO } from '../../dto/out.observer-zcn.add-address-for-observe.dto';
import { ObserverZcnMessagesFromMasterEnum } from '../../const/observer-zcn.messages-from-master.enum';
import { AccountCreatedZcnWalletEvent } from '../../../../../account/events/impl/account.created-zcn-wallet.event';
import { ConfigsService } from '../../../../../core/service/configs.service';
import { getMicroservicesClientOptions } from '../../../../../core/util/get-microservices-client-options';

@EventsHandler(AccountCreatedZcnWalletEvent)
export class ObserverZcnCreateAccountEventHandler implements IEventHandler<AccountCreatedZcnWalletEvent> {
  client: ClientProxy;

  constructor() {
    if (!ConfigsService.useRedis) {
      return;
    }

    this.client = ClientProxyFactory.create(getMicroservicesClientOptions());
  }

  async handle(event: AccountCreatedZcnWalletEvent) {
    if (!ConfigsService.useRedis) {
      return;
    }

    try {
      const dto = new OutObserverZcnAddAddressForObserveDTO(event.walletAddress);
      await this.client.send(ObserverZcnMessagesFromMasterEnum.AddNewAddressForObserve, dto).toPromise();
    } catch (e) {
      Logger.error(e.message, undefined, ObserverZcnCreateAccountEventHandler.name);
    }
  }
}