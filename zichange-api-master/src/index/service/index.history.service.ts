import { Logger, OnApplicationBootstrap } from '@nestjs/common';
import { CronJob } from 'cron';
import { IndexRepository } from '../repository/index.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { IndexHistoryRepository } from '../repository/index.history.repository';
import { IndexHistoryItemEntity } from '../entity/index.history-item.entity';
import { getMidnight } from '../../core/util/date-utils';
import { IndexRatesService } from './index.rates.service';
import { IndexEntity } from '../entity/index.entity';
import { OutIndexHistoryItemDTO } from '../dto/out.index-history-item.dto';
import { ConfigsService } from '../../core/service/configs.service';

export class IndexHistoryService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(IndexRepository)
    private readonly indexRepository: IndexRepository,

    @InjectRepository(IndexHistoryRepository)
    private readonly indexHistoryRepository: IndexHistoryRepository,

    private readonly indexRatesService: IndexRatesService,
  ) { }

  // region Public methods

  onApplicationBootstrap() {
    if (!ConfigsService.isProduction) {
      this.saveHistory();
    }

    new CronJob('0 0 0 * * *', () => this.saveHistory());
  }

  async getHistoryForIndex(index: IndexEntity): Promise<OutIndexHistoryItemDTO[]> {
    const historyItems = await this.indexHistoryRepository.getHistoryForIndex(index.id);
    return historyItems.map(item => new OutIndexHistoryItemDTO(item));
  }

  // endregion

  // region Private methods

  private async saveHistory() {
    try {
      const indexes = await this.indexRepository.getAll();
      const historyItems: IndexHistoryItemEntity[] = [];

      for (const index of indexes) {
        const entity = new IndexHistoryItemEntity();

        entity.index = index;
        entity.date = getMidnight();
        entity.supply = index.supply;
        entity.totalValueInEUR = this.indexRatesService.getTotalValueForIndexInUER(index);

        historyItems.push(entity);
      }

      await this.indexHistoryRepository.save(historyItems);
    } catch (e) {
      Logger.error(e.message, undefined, `${IndexHistoryService.name}.${this.saveHistory.name}`);
    }
  }

  // endregion
}