import { HttpService, Injectable, Logger } from '@nestjs/common';
import { ConfigsService } from '../../../core/service/configs.service';

type RegularCryptoCoinsRaw = 'btc' | 'ltc' | 'xrp' | 'bch' | 'xlm' | 'dash' | 'zec' | 'bsv' | 'btg';

@Injectable()
export class BitGoCryptoWalletGeneratorService {
  constructor(
    protected readonly httpService: HttpService,
  ) { }

  // region Public methods

  async getEthAddress(index: number, inputEmail: string): Promise<string | undefined> {
    const convertedEmail = this.convertEmail(inputEmail);

    try {
      const walletId = ConfigsService.bitgoEthWalletId;
      const coin = 'eth';
      const url = `https://www.bitgo.com/api/v2/${coin}/wallet/${walletId}/addresses?sort=-1&labelContains=${convertedEmail}`;

      const resultRequest = await this.httpService.get(url, {
        headers: {
          Authorization: `Bearer ${ConfigsService.bitgoAccessToken}`,
        },
      }).toPromise();

      const addressRaw = (resultRequest.data.addresses as any[]).find(item => item.index === index);
      if (!addressRaw) {
        return undefined;
      }

      if (typeof addressRaw.address === 'string') {
        return addressRaw.address;
      }

      return undefined;
    } catch (e) {
      Logger.error(e.message, undefined, BitGoCryptoWalletGeneratorService.name);
      return undefined;
    }
  }

  async generateAddress(coin: RegularCryptoCoinsRaw, inputEmail: string): Promise<string | undefined> {
    const convertedEmail = this.convertEmail(inputEmail);
    const walletId = this.getWalletId(coin);

    if (!walletId) {
      Logger.error(`Not founded wallet id for coin: ${coin}`, undefined, BitGoCryptoWalletGeneratorService.name);
      return undefined;
    }

    try {
      const url = `https://www.bitgo.com/api/v2/${coin}/wallet/${walletId}/address`;

      const resultRequest = await this.httpService.post(url, { label: convertedEmail }, {
        headers: {
          Authorization: `Bearer ${ConfigsService.bitgoAccessToken}`,
        },
      }).toPromise();

      const address = resultRequest.data.address;
      if (typeof address === 'string') {
        return address;
      }

      Logger.error(`Address is not string. Url: ${url}. ${JSON.stringify(resultRequest.data)}`,
        undefined, BitGoCryptoWalletGeneratorService.name);

      return undefined;
    } catch (e) {
      Logger.error(e.message, undefined, BitGoCryptoWalletGeneratorService.name);
      return undefined;
    }
  }

  async generateEthIndex(inputEmail: string): Promise<number | undefined> {
    const convertedEmail = this.convertEmail(inputEmail);

    try {
      const coin = 'eth';
      const walletId = ConfigsService.bitgoEthWalletId;
      const url = `https://www.bitgo.com/api/v2/${coin}/wallet/${walletId}/address`;

      const resultRequest = await this.httpService.post(url, { label: convertedEmail }, {
        headers: {
          Authorization: `Bearer ${ConfigsService.bitgoAccessToken}`,
        },
      }).toPromise();

      const index = resultRequest.data.index;

      if (typeof index === 'number') {
        return index;
      }

      Logger.error(`Address index is not number. Url: ${url}. ${JSON.stringify(resultRequest.data)}`,
        undefined, BitGoCryptoWalletGeneratorService.name);

      return undefined;
    } catch (e) {
      Logger.error(e.message, undefined, BitGoCryptoWalletGeneratorService.name);
      return undefined;
    }
  }

  // endregion

  // region Private methods

  private getWalletId(coin: RegularCryptoCoinsRaw): string | undefined {
    const coinToWallet: Record<RegularCryptoCoinsRaw, string> = {
      btc: ConfigsService.bitgoBtcWalletId,
      ltc: ConfigsService.bitgoLtcWalletId,
      xrp: ConfigsService.bitgoXrpWalletId,
      bch: ConfigsService.bitgoBchWalletId,
      xlm: ConfigsService.bitgoXlmWalletId,
      dash: ConfigsService.bitgoDashWalletId,
      zec: ConfigsService.bitgoZecWalletId,
      bsv: ConfigsService.bitgoBsvWalletId,
      btg: ConfigsService.bitgoBtgWalletId,
    };

    return coinToWallet[coin];
  }

  private btoa(str: string): string {
    return Buffer.from(str).toString('base64');
  }

  private utf8_to_b64(str: string): string {
    return this.btoa(unescape(encodeURIComponent(str)));
  }

  private convertEmail(email: string): string {
    return this.utf8_to_b64(email);
  }

  // endregion
}