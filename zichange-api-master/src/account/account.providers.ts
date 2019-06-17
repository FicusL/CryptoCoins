import { Provider } from '@nestjs/common';
import { CryptoWalletGeneratorBase } from './abstract/crypto-wallet-generator.base.service';
import { CryptoWalletGeneratorService } from './service/crypto-wallet-generating/crypto-wallet-generator.service';
import { CryptoWalletGeneratorMock } from './service/crypto-wallet-generating/crypto-wallet-generator.mock';
import { ConfigsService } from '../core/service/configs.service';

export const AccountProviders: Provider[] = [
  {
    provide: CryptoWalletGeneratorBase,
    useClass: ConfigsService.isProduction ? CryptoWalletGeneratorService : CryptoWalletGeneratorMock,
  },
];