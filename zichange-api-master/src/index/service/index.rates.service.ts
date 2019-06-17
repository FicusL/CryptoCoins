import { Injectable } from '@nestjs/common';
import { BigNumber } from 'bignumber.js';
import { InjectRepository } from '@nestjs/typeorm';
import { IndexRepository } from '../repository/index.repository';
import { IndexEntity } from '../entity/index.entity';
import { IndexNotFoundException } from '../exceptions/index-not-found.exception';
import { FiatCoin } from '../../core/const/coins';
import { RatesServiceProviderBase } from '../../rates/service/rates.service.provider.base';
import { IndexCurrencyEntity } from '../entity/index-currency.entity';
import { createPair } from '../../core/curencies/create-pair';
import { OutIndexDTO } from '../dto/out.index.dto';

@Injectable()
export class IndexRatesService {
  // region Public methods

  constructor(
    @InjectRepository(IndexRepository)
    private readonly indexRepository: IndexRepository,

    private readonly ratesService: RatesServiceProviderBase,
  ) {}

  public async getIndexByTicker(ticker: string): Promise<IndexEntity> {
    const index = await this.indexRepository.getIndexByTicker(ticker);
    if (!index) {
      throw new IndexNotFoundException();
    }
    return index;
  }

  public getTotalValueForIndexInUER(index: IndexEntity): BigNumber {
    let totalValue = new BigNumber('0');

    for (const currencyItem of (index.currencies || [])) {
      const rate = this.ratesService.getRateUnsafely(FiatCoin.EUR, currencyItem.currency);
      totalValue = totalValue.plus(currencyItem.balance.dividedBy(rate));
    }

    return totalValue;
  }

  public getPriceIndexInUER(index: IndexEntity): BigNumber {
    const totalValue = this.getTotalValueForIndexInUER(index);
    return totalValue.dividedBy(index.supply);
  }

  public getPriceIndex(index: IndexEntity, currency): BigNumber {
    const priceInEur = this.getPriceIndexInUER(index);
    const rate = this.ratesService.getRateUnsafely(FiatCoin.EUR, currency);
    return priceInEur.multipliedBy(rate);
  }

  getEUREquivalent(index: IndexEntity, amount: BigNumber): BigNumber {
    const priceInEur = this.getPriceIndexInUER(index);
    return amount.multipliedBy(priceInEur);
  }

  public getWeights(index: IndexEntity): Map<string, BigNumber> {
    const result = new Map<string, BigNumber>();

    const totalValue = this.getTotalValueForIndexInUER(index);

    for (const currencyItem of (index.currencies || [])) {
      const currencyPrice = (new BigNumber('1')).dividedBy(this.ratesService.getRateUnsafely(FiatCoin.EUR, currencyItem.currency));
      const weight = (currencyItem.balance.multipliedBy(currencyPrice)).dividedBy(totalValue);
      result.set(currencyItem.currency, weight);
    }

    return result;
  }

  public getWeight(index: IndexEntity, currency: IndexCurrencyEntity): BigNumber {
    const weights = this.getWeights(index);
    return weights.get(currency.currency)!;
  }

  public getAdditionalIndexData(index: IndexEntity): { priceInEur: BigNumber, totalValueInEur: BigNumber } {
    return {
      priceInEur: this.getPriceIndexInUER(index),
      totalValueInEur: this.getTotalValueForIndexInUER(index),
    };
  }

  public getIndexDTO(index: IndexEntity): OutIndexDTO {
    return new OutIndexDTO(index, this.getAdditionalIndexData(index), this.getGetter(index));
  }

  // TODO: rename
  public getGetter(index: IndexEntity): (currency: IndexCurrencyEntity) => { priceInEUR: BigNumber, changePriceInEUR: BigNumber, weight: BigNumber } {
    return (currency: IndexCurrencyEntity) => {
      return {
        priceInEUR: (new BigNumber('1')).dividedBy(this.ratesService.getRateUnsafely(FiatCoin.EUR, currency.currency)),
        changePriceInEUR: this.ratesService.rates.change[createPair(currency.currency, FiatCoin.EUR)] || new BigNumber('0'),
        weight: this.getWeight(index, currency),
      };
    };
  }

  // endregion
}