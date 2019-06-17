import * as dotenv from 'dotenv-safe';
dotenv.config({ allowEmptyValues: true });

import { ITestData } from './common/types/test-data.interface';
import { initApplicationForTesting } from './common/init-application-for-testing';

jest.setTimeout(30 * 1000);

describe('AppController (e2e)', () => {
  let testData: ITestData;

  beforeAll(async () => {
    testData = await initApplicationForTesting();
  });

  it('/GET /health', async () => {
    return await testData.agent
      .get('/health')
      .expect(200)
      .expect('OK');
  });

  afterAll(async () => {
    await testData.app.close();
  });
});