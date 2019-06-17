import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndexCurrencyRepository } from './repository/index-currency.repository';
import { IndexCurrencyEntity } from './entity/index-currency.entity';
import { IndexRepository } from './repository/index.repository';
import { IndexEntity } from './entity/index.entity';
import { IndexService } from './service/index.service';
import { IndexRatesService } from './service/index.rates.service';
import { RatesModule } from '../rates/rates.module';
import { IndexAdminController } from './controller/index.admin.controller';
import { IndexController } from './controller/index.controller';
import { IndexHistoryRepository } from './repository/index.history.repository';
import { IndexHistoryItemEntity } from './entity/index.history-item.entity';
import { IndexHistoryService } from './service/index.history.service';
import { IndexHistoryController } from './controller/index.history.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IndexEntity,
      IndexRepository,

      IndexCurrencyEntity,
      IndexCurrencyRepository,

      IndexHistoryItemEntity,
      IndexHistoryRepository,
    ]),

    RatesModule,
  ],

  providers: [
    IndexService,
    IndexRatesService,
    IndexHistoryService,
  ],
  controllers: [
    IndexAdminController,
    IndexController,
    IndexHistoryController,
  ],
  exports: [
    IndexService,
    IndexRatesService,
  ],
})
export class IndexModule { }