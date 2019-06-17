import { HttpModule, Module, OnModuleInit } from '@nestjs/common';
import { AccountService } from './service/account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './entitiy/account.entity';
import { AccountRepository } from './repository/account.repository';
import { AccountController } from './controller/account.controller';
import { CaptchaModule } from '../core/modules/captcha/captcha.module';
import { Account2FAController } from './controller/account.2fa.controller';
import { AccountUpdatePasswordController } from './controller/account.password.controller';
import { AccountAuthController } from './controller/account.auth.controller';
import { Account2FAService } from './service/account.2fa.service';
import { KycEntity } from '../kyc/entity/kyc.entity';
import { KycRepository } from '../kyc/repository/kyc.repository';
import { accountMiddlewares } from './middleware';
import { TransactionEntity } from '../transaction/entity/transaction.entity';
import { TransactionEUREquivalentRepository } from '../transaction/repository/transaction.eur-equivalent.repository';
import { InviteCodeEntity } from './entitiy/invite-code.entity';
import { InviteCodesRepository } from './repository/invite-codes.repository';
import { InviteCodesService } from './service/invite-codes.service';
import { InviteCodesController } from './controller/invite-codes.controller';
import { AccountAdminController } from './controller/account.admin.controller';
import { CoreEmailModule } from '../core/modules/email/core.email.module';
import { EventBus, CQRSModule, CommandBus } from '@nestjs/cqrs';
import { ModuleRef } from '@nestjs/core';
import { AccountEventHandlers } from './events/handlers';
import { AccountCommandHandlers } from './commands/handlers';
import { AccountReferralController } from './controller/account.referral.controller';
import { AccountReferralService } from './service/account.referral.service';
import { SettingsModule } from '../settings/settings.module';
import { CoreModule } from '../core/core.module';
import { TransactionRepository } from '../transaction/repository/transaction.repository';
import { AccountProviders } from './account.providers';
import { BitGoCryptoWalletGeneratorService } from './service/crypto-wallet-generating/bitgo.crypto-wallet-generator.service';
import { CryptoWalletCheckerService } from './service/crypto-wallet-checker.service';
import { BalanceModule } from '../balance/balance.module';
import { AccountChangeEmailService } from './service/account.change-email.service';
import { AccountChangeEmailController } from './controller/account.change-email.controller';
import { AccountChangeEmailRequestRepository } from './repository/account.change-email-request.repository';
import { AccountChangeEmailRequestEntity } from './entitiy/account.change-email.request.entity';

@Module({
  imports: [
    CQRSModule,
    HttpModule,

    TypeOrmModule.forFeature([
      AccountEntity,
      AccountRepository,

      InviteCodeEntity,
      InviteCodesRepository,

      KycEntity,
      KycRepository,

      TransactionEntity,
      TransactionEUREquivalentRepository,
      TransactionRepository,

      AccountChangeEmailRequestEntity,
      AccountChangeEmailRequestRepository,
    ]),

    CaptchaModule,
    CoreEmailModule,
    CoreModule,
    SettingsModule,
    BalanceModule,
  ],
  providers: [
    AccountService,
    Account2FAService,
    AccountReferralService,
    BitGoCryptoWalletGeneratorService,
    CryptoWalletCheckerService,
    AccountChangeEmailService,

    InviteCodesService,

    ...accountMiddlewares,

    ...AccountEventHandlers,
    ...AccountCommandHandlers,

    ...AccountProviders,
  ],
  controllers: [
    AccountController,
    AccountAuthController,
    AccountUpdatePasswordController,
    Account2FAController,
    InviteCodesController,
    AccountAdminController,
    AccountReferralController,
    AccountChangeEmailController,
  ],
  exports: [
    AccountService,
    Account2FAService,

    ...accountMiddlewares,
  ],
})
export class AccountModule implements OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly command$: CommandBus,
    private readonly event$: EventBus,
  ) {}

  onModuleInit() {
    this.command$.setModuleRef(this.moduleRef);
    this.event$.setModuleRef(this.moduleRef);

    this.event$.register(AccountEventHandlers);
    this.command$.register(AccountCommandHandlers);
  }
}
