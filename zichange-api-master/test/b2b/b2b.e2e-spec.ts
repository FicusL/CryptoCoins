import * as dotenv from 'dotenv-safe';
dotenv.config({ allowEmptyValues: true });

import { ITestData } from '../common/types/test-data.interface';
import { initApplicationForTesting } from '../common/init-application-for-testing';
import { B2bHelperService } from './b2b-helper.service';
import { TransactionsHelperService } from '../transactions/transactions.helper.service';
import { CurrencyPairEntity } from '../../src/transaction/entity/currency-pair.entity';
import { OutCounterpartyGenerateApiKeyDTO } from '../../src/counterparty/dto/out.counterparty.generate-api-key.dto';
import { InCounterpartyV1CreateTransactionDTO } from '../../src/counterparty/dto/v1/in/in.counterparty.v1.create-transaction.dto';
import { CounterpartyService } from '../../src/counterparty/service/counterparty.service';
import { AccountEntity } from '../../src/account/entitiy/account.entity';
import { CounterpartyAdminService } from '../../src/counterparty/service/counterparty.admin.service';
import { InCounterpartyV1StatusTransactionDTO } from '../../src/counterparty/dto/v1/in/in.counterparty.v1.status-transaction.dto';
import { InCounterpartyV1TransactionHistoryDTO } from '../../src/counterparty/dto/v1/in/in.counterparty.v1.transaction-history.dto';
import { InCounterpartyV1GetLimitDTO } from '../../src/counterparty/dto/v1/in/in.counterparty.v1.get-limit.dto';
import { InCounterpartyV1GetPriceDTO } from '../../src/counterparty/dto/v1/in/in.counterparty.v1.get-price.dto';

jest.setTimeout(30 * 1000);

describe('b2b (e2e)', () => {
  let testData: ITestData;
  let b2bHelperService: B2bHelperService;
  let pair: CurrencyPairEntity;
  let apiKey: OutCounterpartyGenerateApiKeyDTO;
  let counterpartyService: CounterpartyService;
  let transactionsHelperService: TransactionsHelperService;
  let counterpartyAdminService: CounterpartyAdminService;
  let nonce: number = 0;
  let counterpartyAccount: AccountEntity;
  let account: AccountEntity;
  let transaction_id: number;
  const badSignature = 'bad_signature';

  beforeAll(async () => {
    process.env.MOCK_RATES = 'true';

    testData = await initApplicationForTesting({
      providers: [
        B2bHelperService,
        TransactionsHelperService,
      ],
    });

    transactionsHelperService = testData.moduleFixture.get<TransactionsHelperService>(TransactionsHelperService);
    counterpartyService = testData.moduleFixture.get<CounterpartyService>(CounterpartyService);
    b2bHelperService = testData.moduleFixture.get<B2bHelperService>(B2bHelperService);
    counterpartyAdminService = testData.moduleFixture.get<CounterpartyAdminService>(CounterpartyAdminService);

    pair = await b2bHelperService.createPair();

    counterpartyAccount = await transactionsHelperService.createAccountForTestTransactions();
    account = await transactionsHelperService.createAccountForTestTransactions();
    await counterpartyAdminService.createCounterparty(counterpartyAccount);
    apiKey =  await counterpartyService.generateApiKeys(counterpartyAccount, 'label');
  });

  // region Correct signature

  it('/POST /create_transaction', async () => {
    const currentNonce = ++nonce;

    const email = account.email;
    const wallet = '1LK1fif14RajnyspWRTeFQGsL1UuEFUEVJ'; // BTC address
    const amount = 100;
    const fee = 10;

    const signature = b2bHelperService.generateSignature({
      encodeParams: `amount=${amount}&email=${email}&fee=${fee}&pair_id=${pair.id}&wallet=${wallet}`,
      endpoint: '/api/v1/create_transaction',
      nonce: `${currentNonce}`,
      publicKey: apiKey.publicKey,
      secretKey: apiKey.secretKey,
    });

    const result = await testData.agent
      .post('/v1/create_transaction')
      .set({
        'apiauth-key': apiKey.publicKey,
        'apiauth-nonce': currentNonce,
        'apiauth-signature': signature,
      })
      .send({
        wallet,
        email,
        pair_id: pair.id,
        amount,
        fee,
      } as InCounterpartyV1CreateTransactionDTO)
      .expect(201);

    transaction_id = result.body.transaction_id;

    return result;
  });

  it('/POST /status_transaction', async () => {
    const currentNonce = ++nonce;

    const signature = b2bHelperService.generateSignature({
      encodeParams: `transaction_id=${transaction_id}`,
      endpoint: '/api/v1/status_transaction',
      nonce: `${currentNonce}`,
      publicKey: apiKey.publicKey,
      secretKey: apiKey.secretKey,
    });

    return await testData.agent
      .post('/v1/status_transaction')
      .set({
        'apiauth-key': apiKey.publicKey,
        'apiauth-nonce': currentNonce,
        'apiauth-signature': signature,
      })
      .send({ transaction_id } as InCounterpartyV1StatusTransactionDTO)
      .expect(201);
  });

  it('/POST /transaction_history', async () => {
    const currentNonce = ++nonce;

    const signature = b2bHelperService.generateSignature({
      encodeParams: `email=${account.email}`,
      endpoint: '/api/v1/transaction_history',
      nonce: `${currentNonce}`,
      publicKey: apiKey.publicKey,
      secretKey: apiKey.secretKey,
    });

    return await testData.agent
      .post('/v1/transaction_history')
      .set({
        'apiauth-key': apiKey.publicKey,
        'apiauth-nonce': currentNonce,
        'apiauth-signature': signature,
      })
      .send({ email: account.email } as InCounterpartyV1TransactionHistoryDTO)
      .expect(201);
  });

  it('/POST /get_pairs', async () => {
    const currentNonce = ++nonce;

    const signature = b2bHelperService.generateSignature({
      encodeParams: ``,
      endpoint: '/api/v1/get_pairs',
      nonce: `${currentNonce}`,
      publicKey: apiKey.publicKey,
      secretKey: apiKey.secretKey,
    });

    return await testData.agent
      .post('/v1/get_pairs')
      .set({
        'apiauth-key': apiKey.publicKey,
        'apiauth-nonce': currentNonce,
        'apiauth-signature': signature,
      })
      .expect(201);
  });

  it('/POST /get_limit', async () => {
    const currentNonce = ++nonce;

    const signature = b2bHelperService.generateSignature({
      encodeParams: `email=${account.email}`,
      endpoint: '/api/v1/get_limit',
      nonce: `${currentNonce}`,
      publicKey: apiKey.publicKey,
      secretKey: apiKey.secretKey,
    });

    return await testData.agent
      .post('/v1/get_limit')
      .set({
        'apiauth-key': apiKey.publicKey,
        'apiauth-nonce': currentNonce,
        'apiauth-signature': signature,
      })
      .send({ email: account.email } as InCounterpartyV1GetLimitDTO)
      .expect(201);
  });

  it('/POST /get_limits', async () => {
    const currentNonce = ++nonce;

    const signature = b2bHelperService.generateSignature({
      encodeParams: ``,
      endpoint: '/api/v1/get_limits',
      nonce: `${currentNonce}`,
      publicKey: apiKey.publicKey,
      secretKey: apiKey.secretKey,
    });

    return await testData.agent
      .post('/v1/get_limits')
      .set({
        'apiauth-key': apiKey.publicKey,
        'apiauth-nonce': currentNonce,
        'apiauth-signature': signature,
      })
      .expect(201);
  });

  it('/POST /get_price', async () => {
    const currentNonce = ++nonce;

    const signature = b2bHelperService.generateSignature({
      encodeParams: `pair_id=${pair.id}`,
      endpoint: '/api/v1/get_price',
      nonce: `${currentNonce}`,
      publicKey: apiKey.publicKey,
      secretKey: apiKey.secretKey,
    });

    return await testData.agent
      .post('/v1/get_price')
      .set({
        'apiauth-key': apiKey.publicKey,
        'apiauth-nonce': currentNonce,
        'apiauth-signature': signature,
      })
      .send({ pair_id: pair.id } as InCounterpartyV1GetPriceDTO)
      .expect(201);
  });

  // endregion

  // region Incorrect signature

  it('/POST /create_transaction : Bad signature', async () => {
    const currentNonce = ++nonce;

    const email = account.email;
    const wallet = 'test_wallet';
    const amount = 100;
    const fee = 10;

    return await testData.agent
      .post('/v1/create_transaction')
      .set({
        'apiauth-key': apiKey.publicKey,
        'apiauth-nonce': currentNonce,
        'apiauth-signature': badSignature,
      })
      .send({
        wallet,
        email,
        pair_id: pair.id,
        amount,
        fee,
      } as InCounterpartyV1CreateTransactionDTO)
      .expect(400);
  });

  it('/POST /status_transaction : Bad signature', async () => {
    const currentNonce = ++nonce;

    return await testData.agent
      .post('/v1/status_transaction')
      .set({
        'apiauth-key': apiKey.publicKey,
        'apiauth-nonce': currentNonce,
        'apiauth-signature': badSignature,
      })
      .send({ transaction_id } as InCounterpartyV1StatusTransactionDTO)
      .expect(400);
  });

  it('/POST /transaction_history : Bad signature', async () => {
    const currentNonce = ++nonce;

    return await testData.agent
      .post('/v1/transaction_history')
      .set({
        'apiauth-key': apiKey.publicKey,
        'apiauth-nonce': currentNonce,
        'apiauth-signature': badSignature,
      })
      .send({ email: account.email } as InCounterpartyV1TransactionHistoryDTO)
      .expect(400);
  });

  it('/POST /get_pairs : Bad signature', async () => {
    const currentNonce = ++nonce;

    return await testData.agent
      .post('/v1/get_pairs')
      .set({
        'apiauth-key': apiKey.publicKey,
        'apiauth-nonce': currentNonce,
        'apiauth-signature': badSignature,
      })
      .expect(400);
  });

  it('/POST /get_limit : Bad signature', async () => {
    const currentNonce = ++nonce;

    return await testData.agent
      .post('/v1/get_limit')
      .set({
        'apiauth-key': apiKey.publicKey,
        'apiauth-nonce': currentNonce,
        'apiauth-signature': badSignature,
      })
      .send({ email: account.email } as InCounterpartyV1GetLimitDTO)
      .expect(400);
  });

  it('/POST /get_limits : Bad signature', async () => {
    const currentNonce = ++nonce;

    return await testData.agent
      .post('/v1/get_limits')
      .set({
        'apiauth-key': apiKey.publicKey,
        'apiauth-nonce': currentNonce,
        'apiauth-signature': badSignature,
      })
      .expect(400);
  });

  it('/POST /get_price : Bad signature', async () => {
    const currentNonce = ++nonce;

    return await testData.agent
      .post('/v1/get_price')
      .set({
        'apiauth-key': apiKey.publicKey,
        'apiauth-nonce': currentNonce,
        'apiauth-signature': badSignature,
      })
      .send({ pair_id: pair.id } as InCounterpartyV1GetPriceDTO)
      .expect(400);
  });

  // endregion

  afterAll(async () => {
    await testData.app.close();
  });
});