import { Provider } from '@nestjs/common';
import { RatesServiceProviderBase } from './service/rates.service.provider.base';
import { RatesService } from './service/rates.service';
import { ConfigsService } from '../core/service/configs.service';
import { RatesServiceMock } from './service/rates.service.mock';

export const RatesProviders: Provider[] = [
  {
    provide: RatesServiceProviderBase,
    useClass: ConfigsService.mockRates ? RatesServiceMock : RatesService,
  },
];