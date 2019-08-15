import { injectable } from 'inversify';
import { BaseCurrenciesStore } from './BaseCurrenciesStore';

@injectable()
export class CryptoCurrenciesStore extends BaseCurrenciesStore {
  protected static readonly REQUEST_AVAILABLE_CRYPTO_CURRENCIES_TASK = 'REQUEST_AVAILABLE_CRYPTO_CURRENCIES_TASK';

  protected get requestTask(): string {
    return CryptoCurrenciesStore.REQUEST_AVAILABLE_CRYPTO_CURRENCIES_TASK;
  }

  protected get requestURL(): string {
    return '/settings/available_currencies/crypto';
  }
}