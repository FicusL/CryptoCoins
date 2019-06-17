import { RedisOptions, Transport } from '@nestjs/microservices';
import { ConfigsService } from '../service/configs.service';

export function getMicroservicesClientOptions(): RedisOptions {
  return {
    transport: Transport.REDIS,
    options: {
      url: ConfigsService.redisUrl,
      retryAttempts: 5,
      retryDelay: 3000,
    },
  };
}