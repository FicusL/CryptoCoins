import { RedisService } from './redis.service';
import { Injectable } from '@nestjs/common';

// region types

interface IRates {
  bid: Record<string, string>;
  ask: Record<string, string>;
  change: Record<string, string>;
  median: Record<string, string>;
}

interface IEurRatesItem {
  currency: string;
  value: string;
}

interface IEurRates {
  values: IEurRatesItem[];
}

enum RedisRatesKeysEnum {
  Rates = 'zichange_rates',
  EurRAtes = 'zichange_eur_rates',
}

// endregion

@Injectable()
export class CoreRatesRedisService {
  protected static readonly timeToLive = 5 * 60 * 1000;

  constructor(
    protected readonly redisService: RedisService,
  ) { }

  async saveRates(rates: IRates): Promise<boolean> {
    return await this.redisService.setOnMilliseconds(
      RedisRatesKeysEnum.Rates,
      JSON.stringify(rates),
      CoreRatesRedisService.timeToLive,
    );
  }

  async saveEurRates(rates: IEurRates): Promise<boolean> {
    return await this.redisService.setOnMilliseconds(
      RedisRatesKeysEnum.EurRAtes,
      JSON.stringify(rates),
      CoreRatesRedisService.timeToLive,
    );
  }

  async getRates(): Promise<IRates | undefined> {
    const ratesRaw = await this.redisService.getValue(RedisRatesKeysEnum.Rates);
    if (!ratesRaw) {
      return undefined;
    }

    return JSON.parse(ratesRaw);
  }

  async getEurRates(): Promise<IEurRates | undefined> {
    const ratesRaw =  await this.redisService.getValue(RedisRatesKeysEnum.EurRAtes);

    if (!ratesRaw) {
      return undefined;
    }

    return JSON.parse(ratesRaw);
  }
}