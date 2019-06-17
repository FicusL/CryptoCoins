import { Module } from '@nestjs/common';
import { RedisService } from './service/redis.service';
import { CoreRatesRedisService } from './service/core.rates-redis.service';

@Module({
  providers: [
    RedisService,
    CoreRatesRedisService,
  ],
  exports: [
    RedisService,
    CoreRatesRedisService,
  ],
})
export class CoreModule { }