import { EntityRepository, Repository } from 'typeorm';
import { CurrencyPairEntity } from '../entity/currency-pair.entity';

@EntityRepository(CurrencyPairEntity)
export class CurrencyPairRepository extends Repository<CurrencyPairEntity> {
  getById(pairId: number) {
    return this.findOne({
      where: {
        id: pairId,
      },
    });
  }

  getAll() {
    return this.find();
  }

  async getAllCurrencies(): Promise<string[]> {
    const result = new Set<string>();

    const pairs = await this.getAll();
    for (const pair of pairs) {
      result.add(pair.currencyBuy);
      result.add(pair.currencySell);
    }

    return Array.from(result.keys());
  }
}