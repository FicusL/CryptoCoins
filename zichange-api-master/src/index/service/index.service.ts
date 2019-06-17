import { Injectable } from '@nestjs/common';
import { IndexRepository } from '../repository/index.repository';
import { IndexEntity } from '../entity/index.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IndexNotFoundException } from '../exceptions/index-not-found.exception';
import { InAddIndexDTO } from '../dto/in.add-index.dto';
import { InChangeIndexDTO } from '../dto/in.change-index.dto';
import { InAddIndexCurrencyDTO } from '../dto/in.add-index-currency.dto';
import { InChangeIndexCurrencyDTO } from '../dto/in.change-index-currency.dto';
import { BigNumber } from 'bignumber.js';
import { IndexAlreadyExistsException } from '../exceptions/index-already-exists.exception';
import { IndexCurrencyRepository } from '../repository/index-currency.repository';
import { IndexCurrencyEntity } from '../entity/index-currency.entity';
import { IndexCurrencyAlreadyExistsException } from '../exceptions/index-currency-already-exists.exception';
import { IndexCurrencyNotExistsException } from '../exceptions/index-currency-not-exists.exception';
import { BadIndexSupplyException } from '../exceptions/bad-index-supply.exception';
import { FiatCoin } from '../../core/const/coins';
import { RatesServiceProviderBase } from '../../rates/service/rates.service.provider.base';
import { IChangeIndexSupply } from '../types/change-index-supply.interface';

@Injectable()
export class IndexService {
  constructor(
    @InjectRepository(IndexRepository)
    private readonly indexRepository: IndexRepository,

    @InjectRepository(IndexCurrencyRepository)
    private readonly indexCurrencyRepository: IndexCurrencyRepository,

    private readonly ratesService: RatesServiceProviderBase,
  ) { }

  // region Public Methods

  public async handleChangeIndexSupply(data: IChangeIndexSupply) {
    await Promise.all([
      this.handleChangeSupplyForIndex(data),
      this.handleChangeSupplyForIndexCurrencies(data),
    ]);
  }

  async getIndexByTicker(ticker: string): Promise<IndexEntity> {
    const index = await this.indexRepository.getIndexByTicker(ticker);
    if (!index) {
      throw new IndexNotFoundException();
    }
    return index;
  }

  async getAllIndexes(): Promise<IndexEntity[]> {
    return await this.indexRepository.getAll();
  }

  async addIndex(indexTicker: string, dto: InAddIndexDTO): Promise<IndexEntity> {
    const index = new IndexEntity();

    const supply = new BigNumber(dto.supply);

    if (supply.isLessThanOrEqualTo('0')) {
      throw new BadIndexSupplyException();
    }

    index.supply = supply;
    index.title = dto.title;
    index.ticker = indexTicker;

    try {
      return await this.indexRepository.saveWithoutCurrencies(index);
    } catch (e) {
      throw new IndexAlreadyExistsException();
    }
  }

  async deleteIndex(indexTicker: string): Promise<void> {
    await this.indexRepository.deleteIndexByTicker(indexTicker);
  }

  async changeIndex(indexTicker: string, dto: InChangeIndexDTO): Promise<IndexEntity> {
    const index = await this.getIndexByTicker(indexTicker);

    index.title = dto.title || index.title;
    index.supply = dto.supply ? new BigNumber(dto.supply) : index.supply;

    return await this.indexRepository.saveWithoutCurrencies(index);
  }

  async addCurrencyToIndex(index: IndexEntity, indexCurrency: string, dto: InAddIndexCurrencyDTO): Promise<IndexEntity> {
    this.ratesService.getRateUnsafely(FiatCoin.EUR, indexCurrency); // used in calculations

    const entity = new IndexCurrencyEntity();

    entity.index = index;
    entity.balance = new BigNumber(dto.balance);
    entity.currency = indexCurrency;

    try {
      await this.indexCurrencyRepository.save(entity);
    } catch (e) {
      throw new IndexCurrencyAlreadyExistsException();
    }

    return await this.getIndexByTicker(index.ticker);
  }

  async deleteCurrencyFromIndex(index: IndexEntity, indexCurrency: string): Promise<IndexEntity> {
    const currencies = index.currencies || [];
    const found = currencies.find(currency => currency.currency === indexCurrency);

    if (!found) {
      throw new IndexCurrencyNotExistsException();
    }

    await this.indexCurrencyRepository.delete(found);
    return await this.getIndexByTicker(index.ticker);
  }

  async changeIndexCurrency(index: IndexEntity, indexCurrency: string, dto: InChangeIndexCurrencyDTO): Promise<IndexEntity> {
    const currencies = index.currencies || [];
    const found = currencies.find(currency => currency.currency === indexCurrency);

    if (!found) {
      throw new IndexCurrencyNotExistsException();
    }

    found.balance = new BigNumber(dto.balance);
    found.index = index; // for correct saving
    found.indexId = index.id; // for correct saving

    await this.indexCurrencyRepository.save(found);
    return await this.getIndexByTicker(index.ticker);
  }

  // endregion

  // region Private Methods

  private async handleChangeSupplyForIndexCurrencies(data: IChangeIndexSupply) {
    const { oldSupply, newSupply, index } = data;

    const balanceCoef = newSupply.dividedBy(oldSupply);

    for (const currency of (index.currencies || [])) {
      currency.balance = currency.balance.multipliedBy(balanceCoef);
      currency.index = index; // for correct saving
      currency.indexId = index.id; // for correct saving

      await this.indexCurrencyRepository.save(currency);
    }
  }

  private async handleChangeSupplyForIndex(data: IChangeIndexSupply) {
    const { index, newSupply } = data;
    index.supply = newSupply;
    await this.indexRepository.saveWithoutCurrencies(index);
  }

  // endregion
}