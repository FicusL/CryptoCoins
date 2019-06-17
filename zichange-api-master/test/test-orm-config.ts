import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function getTestOrmConfig(): TypeOrmModuleOptions {
  // TODO: use process.env later

  return {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'zichange_api_test',
    password: 'cXPoT4UupZAdXDHXNuZd',
    database: 'zichange_api_test',
    synchronize: true,
    logging: true,
    entities:  [
      'src/**/**.entity.ts',
    ],
    dropSchema: true,
  };
}