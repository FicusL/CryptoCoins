import { EntityRepository, Repository } from 'typeorm';
import { IndexHistoryItemEntity } from '../entity/index.history-item.entity';

@EntityRepository(IndexHistoryItemEntity)
export class IndexHistoryRepository extends Repository<IndexHistoryItemEntity> {
  // region Public methods

  public async getHistoryForIndex(indexId: number): Promise<IndexHistoryItemEntity[]> {
    return this.find({
      where: {
        index: {
          id: indexId,
        },
      },
    });
  }

  // endregion
}