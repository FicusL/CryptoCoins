import { Module, OnModuleInit } from '@nestjs/common';
import { TransactionModule } from '../transaction/transaction.module';
import { PaymentAdvancedCashService } from './service/payment.advanced-cash.service';
import { PaymentPayeerService } from './service/payment.payeer.service';
import { PaymentService } from './service/payment.service';
import { PaymentPayeerController } from './controller/payment.payeer.controller';
import { PaymentAdvancedCashController } from './controller/payment.advanced-cash.controller';
import { NotificationModule } from '../core/modules/notification/notification.module';
import { PaymentBilderlingsController } from './controller/payment.bilderlings.controller';
import { PaymentBilderlingsService } from './service/payment.bilderlings.service';
import { PaymentRoyalPayService } from './service/payment.royalpay.service';
import { PaymentRoyalPayController } from './controller/payment.royalpay.controller';
import { CommandBus, CQRSModule, EventBus } from '@nestjs/cqrs';
import { ModuleRef } from '@nestjs/core';
import { PaymentRbkMoneyController } from './controller/payment.rbk-money.controller';

@Module({
  imports: [
    CQRSModule,
    TransactionModule,
    NotificationModule,
  ],
  providers: [
    PaymentService,
    PaymentPayeerService,
    PaymentAdvancedCashService,
    PaymentBilderlingsService,
    PaymentRoyalPayService,
  ],
  controllers: [
    PaymentPayeerController,
    PaymentAdvancedCashController,
    PaymentBilderlingsController,
    PaymentRoyalPayController,
    PaymentRbkMoneyController,
  ],
})
export class PaymentsModule implements OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly command$: CommandBus,
    private readonly event$: EventBus,
  ) { }

  onModuleInit() {
    this.command$.setModuleRef(this.moduleRef);
    this.event$.setModuleRef(this.moduleRef);
  }
}