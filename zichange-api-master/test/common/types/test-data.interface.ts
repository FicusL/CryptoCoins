import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { Express } from 'express';

export interface ITestData {
  instance: Express;
  agent: request.SuperTest<request.Test>;
  app: INestApplication;
  moduleFixture: TestingModule;
}