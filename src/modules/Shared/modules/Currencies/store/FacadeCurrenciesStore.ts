import { action, computed } from 'mobx';
import { inject, injectable } from 'inversify';
import { CryptoCurrenciesStore } from './concrete/CryptoCurrenciesStore';
import { FiatCurrenciesStore } from './concrete/FiatCurrenciesStore';
import { CurrencyType } from '../const/CurrencyType';
import { BigNumber } from 'bignumber.js';

@injectable()
export class FacadeCurrenciesStore {
  @inject(CryptoCurrenciesStore)
  private readonly cryptoCurrenciesStore: CryptoCurrenciesStore;

  @inject(FiatCurrenciesStore)
  private readonly fiatCurrenciesStore: FiatCurrenciesStore;

  @computed
  get cryptoCurrencies(): string[] {
    return this.cryptoCurrenciesStore.currencies;
  }

  @computed
  get fiatCurrencies(): string[] {
    return this.fiatCurrenciesStore.currencies;
  }

  getCurrencyType(currency: string): CurrencyType | undefined {
    if (this.cryptoCurrencies.indexOf(currency) !== -1) {
      return CurrencyType.Crypto;
    }

    if (this.fiatCurrencies.indexOf(currency) !== -1) {
      return CurrencyType.Fiat;
    }

    return undefined;
  }

  amountToString(amount: BigNumber, currency: string): string {
    const type = this.getCurrencyType(currency);
    if (type === CurrencyType.Crypto) {
      return amount.toFixed(8);
    }

    return amount.toFixed(2);
  }

  @action
  requestAvailableCurrencies() {
    this.cryptoCurrenciesStore.requestCurrencies();
    this.fiatCurrenciesStore.requestCurrencies();
  }
}