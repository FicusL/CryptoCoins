import {Module} from '@nestjs/common';
import {BankAccountService} from './service/bank.account.service';
import {CryptoWalletService} from './service/crypto.wallet.service';
import {BankAccountEntity} from './entity/bank.account.entity';
import {CryptoWalletEntity} from './entity/crypto.wallet.entity';
import {BankAccountRepository} from './repository/bank.account.repository';
import {CryptoWalletRepository} from './repository/crypto.wallet.repsoitory';
import {BankAccountController} from './controller/bank.account.controller';
import {CryptoWalletController} from './controller/crypto.wallet.controller';
import {RequisiteAccountController} from './controller/requisite.account.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AccountModule} from '../account/account.module';
import {CQRSModule} from '@nestjs/cqrs';

@Module({
  imports: [
    CQRSModule,

    TypeOrmModule.forFeature([
      BankAccountEntity,
      CryptoWalletEntity,

      BankAccountRepository,
      CryptoWalletRepository,
    ]),

    AccountModule,
  ],

  providers: [
    BankAccountService,
    CryptoWalletService,
  ],

  controllers: [
    BankAccountController,
    CryptoWalletController,
    RequisiteAccountController,
  ],

  exports: [
    BankAccountService,
    CryptoWalletService,
  ],
})
export class RequisiteModule { }