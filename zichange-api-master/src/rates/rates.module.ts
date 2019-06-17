import { HttpModule, Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { EventBus, CQRSModule, CommandBus } from '@nestjs/cqrs';
import { RatesCommandHandlers } from './commands/handlers';
import { RatesEventHandlers } from './events/handlers';
import { RatesController } from './controller/rates.controller';
import { RatesProviders } from './rates.providers';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [
    HttpModule,
    CQRSModule,
    CoreModule,
  ],
  controllers: [
    RatesController,
  ],
  providers: [
    ...RatesProviders,

    ...RatesEventHandlers,
    ...RatesCommandHandlers,
  ],
  exports: [
    ...RatesProviders,
  ],
})
export class RatesModule implements OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly command$: CommandBus,
    private readonly event$: EventBus,
  ) {}

  onModuleInit() {
    this.command$.setModuleRef(this.moduleRef);
    this.event$.setModuleRef(this.moduleRef);

    this.event$.register(RatesEventHandlers);
    this.command$.register(RatesCommandHandlers);
  }
}