import { BigNumber } from 'bignumber.js';
import { IRates } from '../../realtime/abstract/realtime.rates.interface';
import { InRatesUpdateRatesDTO } from '../dto/in.rates.update-rates.dto';
import { InRatesUpdateEurRatesDTO } from '../dto/in.rates.update-eur-rates.dto';
import { RateModel } from '../model/available.rates.model';
import { RatesExceptions } from '../const/rates.exceptions';
import { RatesUpdateRatesEvent } from '../events/impl/rates.update-rates.event';
import { EventBus } from '@nestjs/cqrs';

export abstract class RatesServiceProviderBase {
  protected constructor(
    protected readonly eventBus: EventBus,
  ) { }

  // region Private Fields

  private readonly bid = new RateModel();
  private readonly ask = new RateModel();
  private readonly change = new RateModel();
  private readonly median = new RateModel();
  private readonly EURRates = new Map<string, BigNumber>();

  // endregion

  // region Public Methods

  getRate(baseCurrency: string, slaveCurrency: string): BigNumber | undefined {
    if (baseCurrency === 'EUR') {
      return this.EURRates.get(slaveCurrency);
    } else {
      return undefined;
    }
  }

  getRateUnsafely(baseCurrency: string, slaveCurrency: string): BigNumber {
    const rate = this.getRate(baseCurrency, slaveCurrency);

    if (!rate) {
      throw new RatesExceptions.RateCanNotBeCalculated();
    }

    return rate;
  }

  // TODO: use functions later
  get rates(): IRates {
    return {
      bid: this.bid.directions,
      ask: this.ask.directions,
      change: this.change.directions,
      median: this.median.directions,
    };
  }

  getEUREquivalent(currency: string, amount: BigNumber): BigNumber {
    if (currency === 'ZCN') {
      const eurRate = this.validateRate(this.EURRates.get('USD'));
      return amount.multipliedBy('0.1').dividedBy(eurRate);
    } else if (currency === 'USD') {
      const eurRate = this.validateRate(this.EURRates.get(currency));
      return amount.dividedBy(eurRate);
    }

    if (currency === 'EUR') {
      return amount;
    }

    // BTC, ETH
    const rate = this.median.directions[`${currency}-EUR`];
    this.validateRate(rate);

    return amount.multipliedBy(rate);
  }

  updateRatesFromDTO(dto: InRatesUpdateRatesDTO): void {
    this.updateDirections(this.bid, dto.bid);
    this.updateDirections(this.ask, dto.ask);
    this.updateDirections(this.change, dto.change);
    this.updateDirections(this.median, dto.median);

    this.eventBus.publish(new RatesUpdateRatesEvent(this.rates));
  }

  updateEurRatesFromDTO(dto: InRatesUpdateEurRatesDTO): void {
    for (const item of dto.values) {
      this.EURRates.set(item.currency, new BigNumber(item.value));
    }
  }

  // endregion

  // region Private Methods

  private validateRate(rate: BigNumber | undefined): BigNumber {
    if (!rate || rate.isNaN() || !rate.isPositive()) {
      throw new RatesExceptions.CannotBeObtainedEurEquivalent();
    }

    return rate;
  }

  private updateDirections(rate: RateModel, record: Record<string, string>) {
    for (const [ key, value ] of Object.entries(record)) {
      rate.directions[key] = new BigNumber(value);
    }
  }

  // endregion
}