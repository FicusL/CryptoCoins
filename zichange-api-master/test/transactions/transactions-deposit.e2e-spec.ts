import * as dotenv from 'dotenv-safe';
dotenv.config({ allowEmptyValues: true });

import { AccountEntity } from '../../src/account/entitiy/account.entity';
import { TransactionsHelperService } from './transactions.helper.service';
import { InCreateTransactionDTO } from '../../src/transaction/dto/transaction/in.create.transaction.dto';
import { TransactionType } from '../../src/transaction/const/transaction.type.enum';
import { TransactionDepositMethodType } from '../../src/transaction/const/transaction.deposit-method.enum';
import { ITestData } from '../common/types/test-data.interface';
import { initApplicationForTesting } from '../common/init-application-for-testing';
import { authorizeAccount } from '../common/authorize-account';

jest.setTimeout(30 * 1000);

describe('Transactions deposit (e2e)', () => {
  let testData: ITestData;
  let transactionsHelperService: TransactionsHelperService;
  let account: AccountEntity;

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
    account = await transactionsHelperService.createAccountForTestTransactions();

    await authorizeAccount({
      email: account.email,
      password: TransactionsHelperService.AccountPassword,
      agent: testData.agent,
    });
  });

  it('/POST /transactions BTC deposit', async () => {
    return await testData.agent
      .post('/transactions')
      .send({
        type: TransactionType.Deposit,
        deposit: {
          isActive: true,
          type: TransactionDepositMethodType.CryptoWallet,
          currency: 'BTC',
          amount: '2',
        },
      } as InCreateTransactionDTO)
      .expect(201);
  });

  it('/POST /transactions EUR deposit', async () => {
    return await testData.agent
      .post('/transactions')
      .send({
        type: TransactionType.Deposit,
        deposit: {
          isActive: true,
          type: TransactionDepositMethodType.BankAccount,
          currency: 'EUR',
          amount: '300',
        },
      } as InCreateTransactionDTO)
      .expect(201);
  });

  it('/POST /transactions ETH deposit', async () => {
    return await testData.agent
      .post('/transactions')
      .send({
        type: TransactionType.Deposit,
        deposit: {
          isActive: true,
          type: TransactionDepositMethodType.CryptoWallet,
          currency: 'ETH',
          amount: '10',
        },
      } as InCreateTransactionDTO)
      .expect(201);
  });

  it('/POST /transactions ZCN deposit', async () => {
    return await testData.agent
      .post('/transactions')
      .send({
        type: TransactionType.Deposit,
        deposit: {
          isActive: true,
          type: TransactionDepositMethodType.CryptoWallet,
          currency: 'ZCN',
          amount: '300',
        },
      } as InCreateTransactionDTO)
      .expect(201);
  });

  afterAll(async () => {
    await testData.app.close();
  });
});