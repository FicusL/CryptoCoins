import { Injectable, Logger } from '@nestjs/common';
import { RedisClient } from 'redis';
import { ConfigsService } from './configs.service';
import * as redis from 'redis';

@Injectable()
export class RedisService {
  // from redis docs: PX milliseconds -- Set the specified expire time, in milliseconds.
  protected static readonly millisecondsFlag = 'PX';
  protected readonly redisClient: RedisClient;

  constructor() {
    if (ConfigsService.useRedis) {
      this.redisClient = redis.createClient(ConfigsService.redisUrl);
    }
  }

  async setOnMilliseconds(key: string, value: string, ms: number): Promise<boolean> {
    if (!ConfigsService.useRedis) {
      return false;
    }

    return await this._setOnMilliseconds(key, value, ms);
  }

  async getValue(key: string): Promise<string | undefined> {
    if (!ConfigsService.useRedis) {
      return undefined;
    }

    return await this._getValue(key);
  }

  // region private methods

  private _setOnMilliseconds(key: string, value: string, ms: number): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.redisClient.set(key, value, RedisService.millisecondsFlag, ms, (error) => {
        if (error) {
          Logger.error(error, undefined, RedisService.name);
          resolve(false);
          return;
        }

        resolve(true);
      });
    });
  }

  private _getValue(key: string): Promise<string | undefined> {
    return new Promise(resolve => {
      this.redisClient.get(key, (error, result) => {
        if (error) {
          Logger.error(error, undefined, RedisService.name);
          resolve(undefined);
          return;
        }

        resolve(result);
      });
    });
  }

  // endregion
}