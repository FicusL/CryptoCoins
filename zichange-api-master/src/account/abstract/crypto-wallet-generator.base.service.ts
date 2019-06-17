import { ICryptoAddresses } from './crypto-addresses.interface';
import { CryptoCoin } from '../../core/const/coins';

export abstract class CryptoWalletGeneratorBase {
  abstract getEthAddress(index: number, email: string): Promise<string | undefined>;
  abstract generateAddresses(email: string, coins: CryptoCoin[]): Promise<ICryptoAddresses>;
}
