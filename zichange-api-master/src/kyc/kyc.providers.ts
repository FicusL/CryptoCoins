import { Provider } from '@nestjs/common';
import { SumsubApiService } from './sumsub/service/sumsub-api.service';
import { SumsubApiBaseService } from './sumsub/service/sumsub-api.base.service';
import { ConfigsService } from '../core/service/configs.service';
import { SumsubApiMock } from './sumsub/service/sumsub-api.mock';

export const KycProviders: Provider[] = [
  {
    provide: SumsubApiBaseService,
    useClass: ConfigsService.mockSumSub ? SumsubApiMock : SumsubApiService,
  },
];