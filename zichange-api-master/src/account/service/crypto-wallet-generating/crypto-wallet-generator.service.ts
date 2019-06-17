import { HttpService, Injectable } from '@nestjs/common';
import { ConfigsService } from '../../../core/service/configs.service';
import { ICryptoAddresses } from '../../abstract/crypto-addresses.interface';
import { CryptoWalletGeneratorBase } from '../../abstract/crypto-wallet-generator.base.service';
import { BitGoCryptoWalletGeneratorService } from './bitgo.crypto-wallet-generator.service';
import { CryptoCoin } from '../../../core/const/coins';

@Injectable()
export class CryptoWalletGeneratorService extends CryptoWalletGeneratorBase {
  constructor(
    private readonly httpService: HttpService,
    private readonly bitGoCryptoWalletGeneratorService: BitGoCryptoWalletGeneratorService,
  ) {
    super();
  }

  async getEthAddress(index: number, email: string): Promise<string | undefined> {
    return await this.bitGoCryptoWalletGeneratorService.getEthAddress(index, email);
  }

  async generateAddresses(email: string, coins: CryptoCoin[]): Promise<ICryptoAddresses> {
    const result: ICryptoAddresses = { };

    if (coins.includes(CryptoCoin.BTC)) {
      result.BTC = await this.bitGoCryptoWalletGeneratorService.generateAddress('btc', email);
    }
    if (coins.includes(CryptoCoin.ETH)) {
      const ethIndex = await this.bitGoCryptoWalletGeneratorService.generateEthIndex(email);

      if (ethIndex !== undefined) {
        result.ETH = { index: ethIndex };
      }
    }
    if (coins.includes(CryptoCoin.LTC)) {
      result.LTC = await this.bitGoCryptoWalletGeneratorService.generateAddress('ltc', email);
    }
    if (coins.includes(CryptoCoin.ZCN)) {
      result.ZCN = await this.generateZcnAddress();
    }

    if (coins.includes(CryptoCoin.XRP)) {
      result.XRP = await this.bitGoCryptoWalletGeneratorService.generateAddress('xrp', email);
    }
    if (coins.includes(CryptoCoin.BCH)) {
      result.BCH = await this.bitGoCryptoWalletGeneratorService.generateAddress('bch', email);
    }
    if (coins.includes(CryptoCoin.XLM)) {
      result.XLM = await this.bitGoCryptoWalletGeneratorService.generateAddress('xlm', email);
    }
    if (coins.includes(CryptoCoin.DASH)) {
      result.DASH = await this.bitGoCryptoWalletGeneratorService.generateAddress('dash', email);
    }
    if (coins.includes(CryptoCoin.ZEC)) {
      result.ZEC = await this.bitGoCryptoWalletGeneratorService.generateAddress('zec', email);
    }
    if (coins.includes(CryptoCoin.BSV)) {
      result.BSV = await this.bitGoCryptoWalletGeneratorService.generateAddress('bsv', email);
    }
    if (coins.includes(CryptoCoin.BTG)) {
      result.BTG = await this.bitGoCryptoWalletGeneratorService.generateAddress('btg', email);
    }

    return result;
  }

  protected async generateZcnAddress(): Promise<string> {
    const response = await this.httpService.get(ConfigsService.generateZcnWalletsUrl).toPromise();
    const result = response.data as {
      data: string;
      status: number;
    };

    return result.data;
  }
}