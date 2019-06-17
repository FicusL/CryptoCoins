import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CounterpartyEntity } from './entity/counterparty.entity';
import { CounterpartyRepository } from './repository/counterparty.repository';
import { CounterpartyV1Controller } from './controller/v1/counterparty.v1.controller';
import { CounterpartyController } from './controller/counterparty.controller';
import { CounterpartAdminController } from './controller/counterpart.admin.controller';
import { CounterpartyAdminService } from './service/counterparty.admin.service';
import { CounterpartyService } from './service/counterparty.service';
import { AccountModule } from '../account/account.module';
import { TransactionModule } from '../transaction/transaction.module';
import { CounterpartyApiKeyEntity } from './entity/counterparty.api-key.entity';
import { CounterpartyApiKeyRepository } from './repository/counterparty.api-key.repository';
import { CounterpartyV1Service } from './service/v1/counterparty.v1.service';
import { CounterpartyInfoController } from './controller/counterparty.info.controller';
import { CounterpartyAccountController } from './controller/counterparty.account.controller';
import { CounterpartyAccountService } from './service/counterparty.account.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CounterpartyEntity,
      CounterpartyRepository,

      CounterpartyApiKeyEntity,
      CounterpartyApiKeyRepository,
    ]),

    AccountModule,
    TransactionModule,
  ],
  providers: [
    CounterpartyService,
    CounterpartyAdminService,
    CounterpartyV1Service,
    CounterpartyAccountService,
  ],
  controllers: [
    CounterpartyV1Controller,
    CounterpartyController,
    CounterpartAdminController,
    CounterpartyInfoController,
    CounterpartyAccountController,
  ],
})
export class CounterpartyModule { }