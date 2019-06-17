import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { RatesServiceProviderBase } from './rates.service.provider.base';
import { CoreRatesRedisService } from '../../core/service/core.rates-redis.service';

@Injectable()
export class RatesService extends RatesServiceProviderBase implements OnModuleInit {
  constructor(
    readonly eventBus: EventBus,

    protected readonly coreRatesRedisService: CoreRatesRedisService,
  ) {
    super(eventBus);
  }

  onModuleInit() {
    this.initRates();
  }

  protected async initRates() {
    try {
      const rates = await this.coreRatesRedisService.getRates();
      const eurRates = await this.coreRatesRedisService.getEurRates();

      if (rates) {
        this.updateRatesFromDTO(rates);
      }

      if (eurRates) {
        this.updateEurRatesFromDTO(eurRates);
      }
    } catch (e) {
      Logger.error(e.message, undefined, RatesService.name);
    }
  }
}