import { Module } from '@nestjs/common';
import { CaptchaModule } from './core/modules/captcha/captcha.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './account/account.module';
import { RatesModule } from './rates/rates.module';
import { RequisiteModule } from './requisite/requisite.module';
import { KycModule } from './kyc/kyc.module';
import { SettingsModule } from './settings/settings.module';
import { TransactionModule } from './transaction/transaction.module';
import { RealtimeModule } from './realtime/realtime.module';
import { ObserverModule } from './observer/observer.module';
import { PaymentsModule } from './payments/paymetns.module';
import { ContactUsModule } from './contact-us/contact-us.module';
import { HealthController } from './health.controller';
import { getOrmConfig } from './core/util/get-orm-config';
import { CounterpartyModule } from './counterparty/counterparty.module';
import { IndexModule } from './index/index.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(getOrmConfig()),

    AccountModule,
    ContactUsModule,
    ObserverModule,
    CaptchaModule,
    RatesModule,
    RequisiteModule,
    KycModule,
    RealtimeModule,
    SettingsModule,
    TransactionModule,
    PaymentsModule,
    CounterpartyModule,
    IndexModule,
  ],

  controllers: [
    HealthController,
  ],
})
export class AppModule { }
