import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsRepository } from './repository/settings.repository';
import { SettingsEntity } from './entity/settings.entity';
import { SettingsBankAccountController } from './modules/bank-account/controller/settings.bank-account.controller';
import { SettingsAvailableFiatCurrenciesController } from './modules/curencies/controller/settings.available-fiat-currencies.controller';
import { SettingsAvailableCryptoCurrenciesController } from './modules/curencies/controller/settings.available-crypto-currencies.controller';
import { SettingsBankAccountService } from './modules/bank-account/service/settings.bank-account.service';
import { SettingsFiatCurrenciesService } from './modules/curencies/service/concrete/settings.fiat-currencies.service';
import { SettingsCryptoCurrenciesService } from './modules/curencies/service/concrete/settings.crypto-currencies.service';
import { SettingsFacadeCurrenciesService } from './modules/curencies/service/settings.facade.currencies.service';
import { SettingsExchangeMinAmountService } from './modules/min-amounts/service/concrete/settings.exchange-min-amount.service';
import { SettingsWithdrawalMinAmountService } from './modules/min-amounts/service/concrete/settings.withdrawal-min-amount.service';
import { SettingsDepositMinAmountService } from './modules/min-amounts/service/concrete/settings.deposit-min-amount.service';
import { SettingsDepositMinAmountsController } from './modules/min-amounts/controller/settings.deposit-min-amounts.controller';
import { SettingsExchangeMinAmountsController } from './modules/min-amounts/controller/settings.exchange-min-amounts.controller';
import { SettingsWithdrawalMinAmountsController } from './modules/min-amounts/controller/settings.withdrawal-min-amounts.controller';
import { SettingsFacadeMinAmountsService } from './modules/min-amounts/service/settings.facade.min-amounts.service';
import { ModuleRef } from '@nestjs/core';
import { SettingsEventHandlers } from './events/handlers';
import { SettingsCommandHandlers } from './commands/handlers';
import { EventBus, CQRSModule, CommandBus } from '@nestjs/cqrs';
import { SettingsReferralService } from './modules/referral/service/settings.referral.service';
import { SettingsReferralController } from './modules/referral/controller/settings.referral.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SettingsEntity,
      SettingsRepository,
    ]),

    CQRSModule,
  ],

  providers: [
    SettingsBankAccountService,

    SettingsFiatCurrenciesService,
    SettingsCryptoCurrenciesService,
    SettingsFacadeCurrenciesService,

    SettingsDepositMinAmountService,
    SettingsExchangeMinAmountService,
    SettingsWithdrawalMinAmountService,
    SettingsFacadeMinAmountsService,

    SettingsReferralService,

    ...SettingsEventHandlers,
    ...SettingsCommandHandlers,
  ],

  controllers: [
    SettingsBankAccountController,

    SettingsAvailableFiatCurrenciesController,
    SettingsAvailableCryptoCurrenciesController,

    SettingsDepositMinAmountsController,
    SettingsExchangeMinAmountsController,
    SettingsWithdrawalMinAmountsController,

    SettingsReferralController,
  ],

  exports: [
    SettingsBankAccountService,

    SettingsFacadeCurrenciesService,
    SettingsFacadeMinAmountsService,

    SettingsReferralService,
  ],
})
export class SettingsModule implements OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly command$: CommandBus,
    private readonly event$: EventBus,
  ) {}

  onModuleInit() {
    this.command$.setModuleRef(this.moduleRef);
    this.event$.setModuleRef(this.moduleRef);

    this.event$.register(SettingsEventHandlers);
    this.command$.register(SettingsCommandHandlers);
  }
}