import 'reflect-metadata';

import * as dotenv from 'dotenv-safe';
dotenv.config({ allowEmptyValues: true });

import * as express from 'express';
import { BigNumber } from 'bignumber.js';

import * as markoCompiler from 'marko/compiler';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { getSessionMiddleware, prepareSessionStore } from './core/session/session.middleware';
import { getNoCacheMiddleware } from './core/middleware/no-cache.middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { hmr } from './hmr';
import { getCORSMiddleware } from './core/middleware/cors.middleware';
import * as maxListenersExceededWarning from 'max-listeners-exceeded-warning';
import { getMicroservicesClientOptions } from './core/util/get-microservices-client-options';
import { ConfigsService } from './core/service/configs.service';

markoCompiler.configure({
  writeToDisk: false,
});

maxListenersExceededWarning();

declare const module: any;

async function bootstrap() {
  await hmr();

  BigNumber.config({ DECIMAL_PLACES: 128 });

  const instance = express();
  const app = await NestFactory.create(AppModule, instance);

  await prepareSessionStore();
  instance.use(await getSessionMiddleware());
  instance.use(getNoCacheMiddleware());
  instance.use(getCORSMiddleware());

  app.useGlobalPipes(new ValidationPipe({
    validationError: { target: false },
  }));

  const basePath = 'api';
  app.setGlobalPrefix(basePath);

  if (ConfigsService.runSwagger) {
    const options = new DocumentBuilder()
      .setTitle('Zichange API')
      .setDescription('Zichange API description')
      .setBasePath(basePath)
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api/docs', app, document);
  }

  if (ConfigsService.useRedis) {
    app.connectMicroservice(getMicroservicesClientOptions());
    await app.startAllMicroservicesAsync();
  }

  app.getHttpServer().keepAliveTimeout = 600000;
  app.getHttpServer().timeout = 600000;

  await app.listen(process.env.PORT || 3333);

  if (module.hot && !ConfigsService.isProduction) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
// noinspection JSIgnoredPromiseFromCall
bootstrap();
