import * as dotenv from 'dotenv-safe';
dotenv.config({ allowEmptyValues: true });

import { AccountEntity } from '../../src/account/entitiy/account.entity';
import { TransactionsHelperService } from './transactions.helper.service';
import { InCreateTransactionDTO } from '../../src/transaction/dto/transaction/in.create.transaction.dto';
import { TransactionType } from '../../src/transaction/const/transaction.type.enum';
import { ITestData } from '../common/types/test-data.interface';
import { initApplicationForTesting } from '../common/init-application-for-testing';
import { authorizeAccount } from '../common/authorize-account';
import { cryptoDeposit, fiatDeposit } from '../common/deposit-helpers';
import { BigNumber } from 'bignumber.js';
import { TransactionStatus } from '../../src/transaction/const/transaction.status.enum';

jest.setTimeout(60 * 1000);

describe('Transactions exchange (e2e)', () => {
  const stiIndex = 'STI';
  let transactionId = -1;
  let toAmount = new BigNumber(NaN);

  let testData: ITestData;
  let transactionsHelperService: TransactionsHelperService;

  let account_BTC_EUR: AccountEntity;
  let account_BTC_ZCN: AccountEntity;

  let account_EUR_BTC: AccountEntity;
  let account_EUR_ZCN: AccountEntity;

  let account_ZCN_BTC: AccountEntity;
  let account_ZCN_EUR: AccountEntity;

  let account_EUR_STI: AccountEntity;

  beforeAll(async () => {
    process.env.MAILGUN_TEST_MODE = 'true';
    process.env.MOCK_RATES = 'true';

    testData = await initApplicationForTesting({
      providers: [
        TransactionsHelperService,
      ],
    });

    // create account
    transactionsHelperService = testData.moduleFixture.get<TransactionsHelperService>(TransactionsHelperService);

    await transactionsHelperService.createIndex(stiIndex);

    account_BTC_EUR = await transactionsHelperService.createAccountForTestTransactions();
    account_BTC_ZCN = await transactionsHelperService.createAccountForTestTransactions();

    account_EUR_BTC = await transactionsHelperService.createAccountForTestTransactions();
    account_EUR_ZCN = await transactionsHelperService.createAccountForTestTransactions();

    account_ZCN_BTC = await transactionsHelperService.createAccountForTestTransactions();
    account_ZCN_EUR = await transactionsHelperService.createAccountForTestTransactions();

    account_EUR_STI = await transactionsHelperService.createAccountForTestTransactions();
  });

  it('/POST /transactions exchange BTC -> EUR', async () => {
    return await exchangeTestCase({
      testData,
      account: account_BTC_EUR,
      fromCurrency: 'BTC',
      toCurrency: 'EUR',
      depositAmount: '2',
      exchangeAmount: '1',
      useCryptoDeposit: true,
    });
  });

  it('/POST /transactions exchange EUR -> BTC', async () => {
    return await exchangeTestCase({
      testData,
      account: account_EUR_BTC,
      fromCurrency: 'EUR',
      toCurrency: 'BTC',
      depositAmount: '2000',
      exchangeAmount: '1000',
      useCryptoDeposit: false,
    });
  });

  it('/POST /transactions exchange EUR -> ZCN', async () => {
    return await exchangeTestCase({
      testData,
      account: account_EUR_ZCN,
      fromCurrency: 'EUR',
      toCurrency: 'ZCN',
      depositAmount: '2000',
      exchangeAmount: '1000',
      useCryptoDeposit: false,
    });
  });

  it('/POST /transactions exchange ZCN -> EUR', async () => {
    return await exchangeTestCase({
      testData,
      account: account_EUR_ZCN,
      fromCurrency: 'ZCN',
      toCurrency: 'EUR',
      depositAmount: '10000',
      exchangeAmount: '5000',
      useCryptoDeposit: true,
    });
  });

  it('/POST /transactions exchange EUR -> STI', async () => {
    const dataForDeposit = {
      account: account_EUR_STI,
      currency: 'EUR',
      amount: new BigNumber('2500'),
      testData,
    };

    await fiatDeposit(dataForDeposit);

    const result = await createExchangeTransaction({
      toCurrency: stiIndex,
      fromCurrency: 'EUR',
      account: account_EUR_STI,
      exchangeAmount: '2000',
      testData,
      type: TransactionType.BuyBasket,
      expectCode: 201,
    });

    transactionId = result.body.id;
    toAmount = new BigNumber(result.body.exchange.to.amount);

    await transactionsHelperService.setTransactionStatus(transactionId, TransactionStatus.Completed);

    return result;
  });

  it('/POST /transactions exchange correct STI -> EUR', async () => {
    return await createExchangeTransaction({
      toCurrency: 'EUR',
      fromCurrency: stiIndex,
      account: account_EUR_STI,
      exchangeAmount: toAmount.multipliedBy('0.9').toString(),
      testData,
      type: TransactionType.SellBasket,
      expectCode: 201,
    });
  });

  it('/POST /transactions exchange bad STI -> EUR', async () => {
    return await createExchangeTransaction({
      toCurrency: 'EUR',
      fromCurrency: stiIndex,
      account: account_EUR_STI,
      exchangeAmount: toAmount.multipliedBy('0.9').toString(),
      testData,
      type: TransactionType.SellBasket,
      expectCode: 403,
    });
  });

  afterAll(async () => {
    await testData.app.close();
  });
});

async function exchangeTestCase(data: {
    testData: ITestData,
    account: AccountEntity,
    fromCurrency: string,
    toCurrency: string,
    depositAmount: string,
    exchangeAmount: string,
    useCryptoDeposit: boolean,
  }) {
  const { testData, account, depositAmount, fromCurrency, useCryptoDeposit } = data;

  const dataForDeposit = {
    account,
    currency: fromCurrency,
    amount: new BigNumber(depositAmount),
    testData,
  };

  if (useCryptoDeposit) {
    await cryptoDeposit(dataForDeposit);
  } else {
    await fiatDeposit(dataForDeposit);
  }

  return await createExchangeTransaction({
    ...data,
    type: TransactionType.Exchange,
    expectCode: 201,
  });
}

async function createExchangeTransaction(data: {
  testData: ITestData,
  account: AccountEntity,
  fromCurrency: string,
  toCurrency: string,
  exchangeAmount: string,
  type: TransactionType,
  expectCode: number,
}) {
  const { testData, account, exchangeAmount, fromCurrency, toCurrency, type, expectCode } = data;

  await authorizeAccount({
    email: account.email,
    password: TransactionsHelperService.AccountPassword,
    agent: testData.agent,
  });

  return await testData.agent
    .post('/transactions')
    .send({
      type,
      exchange: {
        isActive: true,
        from: {
          currency: fromCurrency,
          amount: exchangeAmount,
        },
        to: {
          currency: toCurrency,
        },
      },
    } as InCreateTransactionDTO)
    .expect(expectCode);
}