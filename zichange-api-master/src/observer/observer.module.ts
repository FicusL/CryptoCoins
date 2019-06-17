import { Module, OnModuleInit } from '@nestjs/common';
import { TransactionModule } from '../transaction/transaction.module';
import { AccountModule } from '../account/account.module';
import { ObserverBtcEventHandlers } from './modules/btc/events/handlers';
import { ModuleRef } from '@nestjs/core';
import { EventBus, CQRSModule } from '@nestjs/cqrs';
import { ObserverEthEventHandlers } from './modules/eth/events/handlers';
import { ObserverZcnEventHandlers } from './modules/zcn/events/handlers';
import { CoreModule } from '../core/core.module';
import { ObserverController } from './observer.controller';

const ObserverEventHandlers = [
  ...ObserverBtcEventHandlers,
  ...ObserverEthEventHandlers,
  ...ObserverZcnEventHandlers,
];

@Module({
  imports: [
    CQRSModule,

    CoreModule,
    TransactionModule,
    AccountModule,
  ],
  providers: [
    ...ObserverEventHandlers,
  ],
  controllers: [
    ObserverController,
  ],
  exports: [],
})
export class ObserverModule implements OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly event$: EventBus,
  ) {}

  onModuleInit() {
    this.event$.setModuleRef(this.moduleRef);

    this.event$.register(ObserverEventHandlers);
  }
}