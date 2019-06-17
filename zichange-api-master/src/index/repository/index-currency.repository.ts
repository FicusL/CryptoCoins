import { EntityRepository, Repository } from 'typeorm';
import { IndexCurrencyEntity } from '../entity/index-currency.entity';

@EntityRepository(IndexCurrencyEntity)
export class IndexCurrencyRepository extends Repository<IndexCurrencyEntity> { }