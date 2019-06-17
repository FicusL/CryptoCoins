import { Module, OnModuleInit } from '@nestjs/common';
import { RealtimeClientGateway } from './gateway/realtime.client.gateway';
import { notificationClientMessageHandlers } from './provider/realtime.client-message-handler.providers';
import { RatesModule } from '../rates/rates.module';
import { TransactionModule } from '../transaction/transaction.module';
import { RealtimeAdminGateway } from './gateway/realtime.admin.gateway';
import { notificationAdminMessageHandlers } from './provider/realtime.admin-message-handler.providers';
import { KycModule } from '../kyc/kyc.module';
import { AccountModule } from '../account/account.module';
import { SettingsModule } from '../settings/settings.module';
import { ModuleRef } from '@nestjs/core';
import { EventBus, CQRSModule } from '@nestjs/cqrs';
import { RealtimeEventHandlers } from './events/handlers';
import { RealtimeController } from './controller/realtime.controller';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [
    CoreModule,
    RatesModule,
    TransactionModule,
    KycModule,
    AccountModule,
    SettingsModule,

    CQRSModule,
  ],
  providers: [
    ...notificationClientMessageHandlers,
    ...notificationAdminMessageHandlers,

    RealtimeClientGateway,
    RealtimeAdminGateway,

    ...RealtimeEventHandlers,
  ],
  controllers: [
    RealtimeController,
  ],
})
export class RealtimeModule implements OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly event$: EventBus,
  ) {}

  onModuleInit() {
    this.event$.setModuleRef(this.moduleRef);

    this.event$.register(RealtimeEventHandlers);
  }
}