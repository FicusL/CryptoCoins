import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function getOrmConfig(): TypeOrmModuleOptions {
  return {
    // @ts-ignore
    type: process.env.DB_TYPEORM_CONNECTION || 'postgres',
    host: process.env.DB_TYPEORM_HOST || '0.0.0.0',
    port: Number(process.env.DB_TYPEORM_PORT) || 5432,
    username: process.env.DB_TYPEORM_USERNAME || 'zichange_api_dev',
    password: process.env.DB_TYPEORM_PASSWORD || 'cXPoT4UupZAdXDHXNuZd',
    database: process.env.DB_TYPEORM_DATABASE || 'zichange_api_dev',
    synchronize: process.env.DB_TYPEORM_SYNCHRONIZE === 'true',
    logging: process.env.DB_TYPEORM_LOGGING === 'true',
    entities:  [
      'dist/**/**.entity.js',
    ],
    keepConnectionAlive: true,
  };
}