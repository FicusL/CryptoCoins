import * as request from 'supertest';
import * as express from 'express';
import { Provider, ValidationPipe } from '@nestjs/common';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { getTestOrmConfig } from '../test-orm-config';
import { AppModule } from '../../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getSessionMiddleware, prepareSessionStore } from '../../src/core/session/session.middleware';
import { getNoCacheMiddleware } from '../../src/core/middleware/no-cache.middleware';
import { getCORSMiddleware } from '../../src/core/middleware/cors.middleware';
import { ITestData } from './types/test-data.interface';

interface IOptions {
  providers?: Provider[];
  prepareBuilder?: (builder: TestingModuleBuilder) => Promise<any>;
}

export async function initApplicationForTesting(options?: IOptions): Promise<ITestData> {
  options = options || { };
  const { providers, prepareBuilder } = options;

  const moduleBuilder = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot(getTestOrmConfig()),
      AppModule,
    ],
    providers,
  });

  if (prepareBuilder) {
    await prepareBuilder(moduleBuilder);
  }

  const moduleFixture = await moduleBuilder.compile();

  const instance = express();
  const agent = request.agent(instance);
  const app = moduleFixture.createNestApplication(instance);

  await prepareSessionStore();
  instance.use(await getSessionMiddleware());
  instance.use(getNoCacheMiddleware());
  instance.use(getCORSMiddleware());

  app.useGlobalPipes(new ValidationPipe({
    validationError: { target: false },
  }));

  await app.init();

  return { instance, agent, app, moduleFixture };
}