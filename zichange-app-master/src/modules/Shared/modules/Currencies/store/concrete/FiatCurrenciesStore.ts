import { injectable } from 'inversify';
import { BaseCurrenciesStore } from './BaseCurrenciesStore';

@injectable()
export class FiatCurrenciesStore extends BaseCurrenciesStore {
  protected static readonly REQUEST_AVAILABLE_FIAT_CURRENCIES_TASK = 'REQUEST_AVAILABLE_FIAT_CURRENCIES_TASK';

  protected get requestTask(): string {
    return FiatCurrenciesStore.REQUEST_AVAILABLE_FIAT_CURRENCIES_TASK;
  }

  protected get requestURL(): string {
    return '/settings/available_currencies/fiat';
  }
}