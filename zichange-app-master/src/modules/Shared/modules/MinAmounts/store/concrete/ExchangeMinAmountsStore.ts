import { BaseMinAmountsStore } from './BaseMinAmountsStore';
import { injectable } from 'inversify';

@injectable()
export class ExchangeMinAmountsStore extends BaseMinAmountsStore {
  protected static readonly REQUEST_EXCHANGE_MIN_AMOUNTS_TASK = 'REQUEST_EXCHANGE_MIN_AMOUNTS_TASK';

  protected get requestTask(): string {
    return ExchangeMinAmountsStore.REQUEST_EXCHANGE_MIN_AMOUNTS_TASK;
  }

  protected get requestURL(): string {
    return '/settings/min_amounts/exchange';
  }

}