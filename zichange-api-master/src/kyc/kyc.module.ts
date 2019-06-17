import { HttpModule, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KycEntity } from './entity/kyc.entity';
import { KycRepository } from './repository/kyc.repository';
import { AccountModule } from '../account/account.module';
import { KycLegalController } from './controller/kyc.legal.controller';
import { KycService } from './service/kyc.service';
import { KycController } from './controller/kyc.controller';
import { KycNaturalController } from './controller/kyc.natural.controller';
import { NotificationModule } from '../core/modules/notification/notification.module';
import { ModuleRef } from '@nestjs/core';
import { EventBus, CQRSModule, CommandBus } from '@nestjs/cqrs';
import { KycEventHandlers } from './events/handlers';
import { KycCommandHandlers } from './commands/handlers';
import { CoreModule } from '../core/core.module';
import { StorageModule } from '../core/modules/storage/storage.module';
import { KycProviders } from './kyc.providers';
import { KycSumsubCheckerService } from './service/kyc-sumsub-checker.service';
import { KycSumsubController } from './controller/kyc.sumsub.controller';
import { KycPdfHelperService } from './service/kyc.pdf-helper.service';
import { KycCreateService } from './service/kyc.create.service';

@Module({
  imports: [
    HttpModule,

    TypeOrmModule.forFeature([
      KycEntity,

      KycRepository,
    ]),

    AccountModule,
    NotificationModule,

    CQRSModule,
    CoreModule,
    StorageModule,
  ],

  providers: [
    KycService,
    KycPdfHelperService,
    KycCreateService,
    KycSumsubCheckerService,

    ...KycEventHandlers,
    ...KycCommandHandlers,

    ...KycProviders,
  ],

  exports: [
    KycService,
    KycCreateService,
  ],

  controllers: [
    KycController,
    KycLegalController,
    KycNaturalController,
    KycSumsubController,
  ],
})
export class KycModule implements OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly command$: CommandBus,
    private readonly event$: EventBus,
  ) {}

  onModuleInit() {
    this.command$.setModuleRef(this.moduleRef);
    this.event$.setModuleRef(this.moduleRef);

    this.event$.register(KycEventHandlers);
    this.command$.register(KycCommandHandlers);
  }
}