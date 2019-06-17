import { EventsHandler , IEventHandler} from '@nestjs/cqrs';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { OutObserverEthAddAddressForObserveDTO } from '../../dto/out.observer-eth.add-address-for-observe.dto';
import { ObserverEthMessagesFromMasterEnum } from '../../const/observer-eth.messages-from-master.enum';
import { AccountCreatedEthWalletEvent } from '../../../../../account/events/impl/account.created-eth-wallet.event';
import { ConfigsService } from '../../../../../core/service/configs.service';
import { getMicroservicesClientOptions } from '../../../../../core/util/get-microservices-client-options';

@EventsHandler(AccountCreatedEthWalletEvent)
export class ObserverEthCreateAccountEventHandler implements IEventHandler<AccountCreatedEthWalletEvent> {
  client: ClientProxy;

  constructor() {
    if (!ConfigsService.useRedis) {
      return;
    }

    this.client = ClientProxyFactory.create(getMicroservicesClientOptions());
  }

  async handle(event: AccountCreatedEthWalletEvent) {
    if (!ConfigsService.useRedis) {
      return;
    }

    try {
      const dto = new OutObserverEthAddAddressForObserveDTO(event.walletAddress);
      await this.client.send(ObserverEthMessagesFromMasterEnum.AddNewAddressForObserve, dto).toPromise();
    } catch (e) {
      Logger.error(e.message, undefined, ObserverEthCreateAccountEventHandler.name);
    }
  }
}