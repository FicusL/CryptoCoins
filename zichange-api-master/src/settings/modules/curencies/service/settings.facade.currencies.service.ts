import { Injectable } from '@nestjs/common';
import { CurrencyType } from '../../../../core/const/core.currency-type.enum';
import { allCryptoCoins, allFiatCoins } from '../../../../core/const/coins';

interface IAllCurrencies {
  [CurrencyType.Crypto]: Array<string>;
  [CurrencyType.Fiat]: Array<string>;
}

@Injectable()
export class SettingsFacadeCurrenciesService {
  async getCurrencyType(currency: string): Promise<CurrencyType | undefined> {
    const currencies = await this.getAllCurrencies();

    const isCryptoCurrency = currencies[CurrencyType.Crypto].includes(currency);
    if (isCryptoCurrency) {
      return CurrencyType.Crypto;
    }

    const isFiatCurrency = currencies[CurrencyType.Fiat].includes(currency);
    if (isFiatCurrency) {
      return CurrencyType.Fiat;
    }

    return undefined;
  }

  async getAllCurrencies(): Promise<IAllCurrencies> {
    const [cryptoCurrencies, fiatCurrencies] = await Promise.all([
      this.getCryptoCurrencies(),
      this.getFiatCurrencies(),
    ]);

    return {
      [CurrencyType.Crypto]: cryptoCurrencies,
      [CurrencyType.Fiat]: fiatCurrencies,
    };
  }

  async getCryptoCurrencies(): Promise<Array<string>> {
    return allCryptoCoins;
  }

  async getFiatCurrencies(): Promise<Array<string>> {
    return allFiatCoins;
  }
}