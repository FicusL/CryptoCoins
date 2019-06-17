import { EntityRepository, Repository } from 'typeorm';
import { IndexEntity } from '../entity/index.entity';

@EntityRepository(IndexEntity)
export class IndexRepository extends Repository<IndexEntity> { 
  async getIndexByTicker(ticker: string): Promise<IndexEntity | undefined> {
    return await this.findOne({
      where: {
        ticker,
      },
      relations: [ 'currencies' ],
    });
  }

  async saveWithoutCurrencies(entity: Readonly<IndexEntity>) {
    const entityForSaving = new IndexEntity(entity);
    entityForSaving.currencies = undefined;
    return await this.save(entityForSaving);
  }

  async getAll(): Promise<IndexEntity[]> {
    return await this.find({
      relations: [ 'currencies' ],
    });
  }

  async deleteIndexByTicker(ticker: string) {
    return await this.delete({
      ticker,
    });
  }
}