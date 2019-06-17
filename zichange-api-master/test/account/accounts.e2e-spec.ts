import * as dotenv from 'dotenv-safe';
dotenv.config({ allowEmptyValues: true });

import { InAccountRegisterDTO } from '../../src/account/dto/in.account.register.dto';
import { AccountType } from '../../src/account/const/account.type.enum';
import { ITestData } from '../common/types/test-data.interface';
import { initApplicationForTesting } from '../common/init-application-for-testing';
import { CryptoWalletGeneratorBase } from '../../src/account/abstract/crypto-wallet-generator.base.service';
import { CryptoWalletGeneratorMock } from '../../src/account/service/crypto-wallet-generating/crypto-wallet-generator.mock';

jest.setTimeout(30 * 1000);

describe('Accounts (e2e)', () => {
  let testData: ITestData;

  beforeAll(async () => {
    testData = await initApplicationForTesting({
      prepareBuilder: async (builder) => {
        builder
          .overrideProvider(CryptoWalletGeneratorBase)
          .useClass(CryptoWalletGeneratorMock);
      },
    });
  });

  it('/POST register natural account', async () => {
    return await testData.agent
      .post('/account/authorization/register')
      .send({
        email: 'natural_account@gmail.com',
        type: AccountType.Natural,
        password: 'Qwerty123!',
      } as InAccountRegisterDTO)
      .expect(201);
  });

  it('/POST register natural account with other password', async () => {
    return await testData.agent
      .post('/account/authorization/register')
      .send({
        email: 'natural_account_2@gmail.com',
        type: AccountType.Natural,
        password: 'Ab1,."/\\;',
      } as InAccountRegisterDTO)
      .expect(201);
  });

  it('/POST register legal account', async () => {
    return await testData.agent
      .post('/account/authorization/register')
      .send({
        email: 'legal_account@gmail.com',
        type: AccountType.LegalEntity,
        password: 'Qwerty123!',
      } as InAccountRegisterDTO)
      .expect(201);
  });

  afterAll(async () => {
    await testData.app.close();
  });
});