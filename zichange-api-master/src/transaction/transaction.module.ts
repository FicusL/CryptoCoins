import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEUREquivalentRepository } from './repository/transaction.eur-equivalent.repository';
import { TransactionEntity } from './entity/transaction.entity';
import { AccountModule } from '../account/account.module';
import { RatesModule } from '../rates/rates.module';
import { SettingsModule } from '../settings/settings.module';
import { RequisiteModule } from '../requisite/requisite.module';
import { KycModule } from '../kyc/kyc.module';
import { TransactionRepository } from './repository/transaction.repository';
import { TransactionAccountController } from './controller/transaction.account.controller';
import { TransactionController } from './controller/transaction.controller';
import { TransactionDepositPartService } from './service/transaction-parts/transaction.deposit-part.service';
import { TransactionExchangePartService } from './service/transaction-parts/transaction.exchange-part.service';
import { TransactionFeePartService } from './service/transaction-parts/transaction.fee-part.service';
import { TransactionWithdrawalPartService } from './service/transaction-parts/transaction.withdrawal-part.service';
import { TransactionLimitsValidationService } from './service/transaction.limits-validation.service';
import { TransactionService } from './service/transaction.service';
import { CQRSModule, CommandBus, EventBus } from '@nestjs/cqrs';
import { ModuleRef } from '@nestjs/core';
import { TransactionAmountsService } from './service/transaction.amounts.service';
import { TransactionReferralPartService } from './service/transaction-parts/transaction.referral-part.service';
import { TransactionAdminController } from './controller/transaction.admin.controller';
import { TransactionAdminService } from './service/transaction.admin.service';
import { TransactionCommandHandlers } from './commands/handlers';
import { TransactionEventHandlers } from './events/handlers';
import { CurrencyPairEntity } from './entity/currency-pair.entity';
import { CurrencyPairRepository } from './repository/currency-pair.repository';
import { TransactionAddressesValidatorService } from './service/addresses-validator/transaction.addresses-validator.service';
import { TransactionCreatorService } from './service/transaction-creator.service';
import { TransactionExchangeRateUpdaterService } from './service/transaction.exchange-rate-updater.service';
import { BalanceModule } from '../balance/balance.module';
import { IndexModule } from '../index/index.module';
import { CalculationsModule } from '../calculation/calculations.module';
import { TransactionManagementFeeService } from './service/transaction.management-fee.service';

@Module({
  imports: [
    CQRSModule,

    TypeOrmModule.forFeature([
      TransactionEntity,

      TransactionRepository,
      TransactionEUREquivalentRepository,

      CurrencyPairEntity,
      CurrencyPairRepository,
    ]),

    KycModule,
    AccountModule,
    SettingsModule,
    RatesModule,
    RequisiteModule,
    BalanceModule,
    IndexModule,
    CalculationsModule,
  ],

  providers: [
    TransactionDepositPartService,
    TransactionExchangePartService,
    TransactionFeePartService,
    TransactionWithdrawalPartService,
    TransactionReferralPartService,
    TransactionLimitsValidationService,
    TransactionService,
    TransactionCreatorService,
    TransactionAmountsService,
    TransactionAdminService,
    TransactionAddressesValidatorService,
    TransactionExchangeRateUpdaterService,
    TransactionManagementFeeService,

    ...TransactionCommandHandlers,
    ...TransactionEventHandlers,
  ],

  controllers: [
    TransactionAccountController,
    TransactionController,
    TransactionAdminController,
  ],

  exports: [
    TransactionService,
    TransactionCreatorService,
    TransactionLimitsValidationService,
    TransactionAddressesValidatorService,
  ],
})
export class TransactionModule implements OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly command$: CommandBus,
    private readonly event$: EventBus,
  ) { }

  onModuleInit() {
    this.command$.setModuleRef(this.moduleRef);
    this.event$.setModuleRef(this.moduleRef);

    this.event$.register(TransactionEventHandlers);
    this.command$.register(TransactionCommandHandlers);
  }
}