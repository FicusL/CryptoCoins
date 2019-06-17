import { CryptoWalletGeneratorBase } from '../../abstract/crypto-wallet-generator.base.service';
import { ICryptoAddresses } from '../../abstract/crypto-addresses.interface';
import { CryptoCoin } from '../../../core/const/coins';

export class CryptoWalletGeneratorMock extends CryptoWalletGeneratorBase {
  async generateAddresses(email: string, coins: CryptoCoin[]): Promise<ICryptoAddresses> {
    return {
      BTC: coins.includes(CryptoCoin.BTC) ? `btc_${Math.random()}` : undefined,
      ETH: coins.includes(CryptoCoin.ETH) ? { index: Math.floor(Date.now() / 1000) } : undefined,
      LTC: coins.includes(CryptoCoin.LTC) ? `ltc_${Math.random()}` : undefined,
      ZCN: coins.includes(CryptoCoin.ZCN) ? `zcn_${Math.random()}` : undefined,

      XRP: coins.includes(CryptoCoin.XRP) ? `xrp_${Math.random()}` : undefined,
      BCH: coins.includes(CryptoCoin.BCH) ? `bch_${Math.random()}` : undefined,
      XLM: coins.includes(CryptoCoin.XLM) ? `xlm_${Math.random()}` : undefined,
      DASH: coins.includes(CryptoCoin.DASH) ? `dash_${Math.random()}` : undefined,
      ZEC: coins.includes(CryptoCoin.ZEC) ? `zec_${Math.random()}` : undefined,
      BSV: coins.includes(CryptoCoin.BSV) ? `bsv_${Math.random()}` : undefined,
      BTG: coins.includes(CryptoCoin.BTG) ? `btg_${Math.random()}` : undefined,
    };
  }

  async getEthAddress(index: number, email: string): Promise<string | undefined> {
    return `eth_${Math.random()}`;
  }
}