import * as dotenv from 'dotenv-safe';
dotenv.config({ allowEmptyValues: true });

import { AccountEntity } from '../../src/account/entitiy/account.entity';
import { TransactionsHelperService } from './transactions.helper.service';
import { ITestData } from '../common/types/test-data.interface';
import { initApplicationForTesting } from '../common/init-application-for-testing';
import { authorizeAccount } from '../common/authorize-account';
import { CryptoWalletEntity } from '../../src/requisite/entity/crypto.wallet.entity';
import { BankAccountEntity } from '../../src/requisite/entity/bank.account.entity';
import { TransactionType } from '../../src/transaction/const/transaction.type.enum';
import { InCreateTransactionDTO } from '../../src/transaction/dto/transaction/in.create.transaction.dto';
import { cryptoDeposit, fiatDeposit } from '../common/deposit-helpers';
import { BigNumber } from 'bignumber.js';
import { TransactionWithdrawalMethodType } from '../../src/transaction/const/transaction.withdrawal-method.enum';

jest.setTimeout(30 * 1000);

describe('Transactions withdrawal (e2e)', () => {
  let testData: ITestData;
  let transactionsHelperService: TransactionsHelperService;

  // crypto accounts
  let account_BTC: AccountEntity;
  let account_ETH: AccountEntity;
  let account_ZCN: AccountEntity;

  // fiat accounts
  let account_EUR: AccountEntity;

  // crypto wallets
  let wallet_BTC: CryptoWalletEntity;
  let wallet_ETH: CryptoWalletEntity;
  let wallet_ZCN: CryptoWalletEntity;

  // banks
  let bank_EUR: BankAccountEntity;

  beforeAll(async () => {
    process.env.MAILGUN_TEST_MODE = 'true';
    process.env.MOCK_RATES = 'true';

    testData = await initApplicationForTesting({
      providers: [
        TransactionsHelperService,
      ],
    });

    transactionsHelperService = testData.moduleFixture.get<TransactionsHelperService>(TransactionsHelperService);

    // create accounts
    account_BTC = await transactionsHelperService.createAccountForTestTransactions();
    account_ETH = await transactionsHelperService.createAccountForTestTransactions();
    account_ZCN = await transactionsHelperService.createAccountForTestTransactions();
    account_EUR = await transactionsHelperService.createAccountForTestTransactions();

    wallet_BTC = await transactionsHelperService.createCryptoWallet(account_BTC);
    wallet_ETH = await transactionsHelperService.createCryptoWallet(account_ETH);
    wallet_ZCN = await transactionsHelperService.createCryptoWallet(account_ZCN);
    bank_EUR = await transactionsHelperService.createBankAccount(account_EUR, 'EUR');
  });

  it('/POST /transactions BTC withdrawal', async () => {
    await authorizeAccount({
      email: account_BTC.email,
      password: TransactionsHelperService.AccountPassword,
      agent: testData.agent,
    });

    await cryptoDeposit({
      account: account_BTC,
      amount: new BigNumber('2'),
      currency: 'BTC',
      testData,
    });

    return await testData.agent
      .post('/transactions')
      .send({
        type: TransactionType.Withdrawal,
        withdrawal: {
          isActive: true,
          type: TransactionWithdrawalMethodType.CryptoWallet,
          currency: 'BTC',
          amount: '1',
          code: '000000',
          methodId: wallet_BTC.id,
        },
      } as InCreateTransactionDTO)
      .expect(201);
  });

  it('/POST /transactions EUR withdrawal', async () => {
    await authorizeAccount({
      email: account_EUR.email,
      password: TransactionsHelperService.AccountPassword,
      agent: testData.agent,
    });

    await fiatDeposit({
      account: account_EUR,
      amount: new BigNumber('3000'),
      currency: 'EUR',
      testData,
    });

    return await testData.agent
      .post('/transactions')
      .send({
        type: TransactionType.Withdrawal,
        withdrawal: {
          isActive: true,
          type: TransactionWithdrawalMethodType.BankAccount,
          currency: 'EUR',
          amount: '2000',
          code: '000000',
          methodId: bank_EUR.id,
        },
      } as InCreateTransactionDTO)
      .expect(201);
  });

  it('/POST /transactions ETH withdrawal', async () => {
    await authorizeAccount({
      email: account_ETH.email,
      password: TransactionsHelperService.AccountPassword,
      agent: testData.agent,
    });

    await cryptoDeposit({
      account: account_ETH,
      amount: new BigNumber('50'),
      currency: 'ETH',
      testData,
    });

    return await testData.agent
      .post('/transactions')
      .send({
        type: TransactionType.Withdrawal,
        withdrawal: {
          isActive: true,
          type: TransactionWithdrawalMethodType.CryptoWallet,
          currency: 'ETH',
          amount: '40',
          code: '000000',
          methodId: wallet_ETH.id,
        },
      } as InCreateTransactionDTO)
      .expect(201);
  });

  it('/POST /transactions ZCN withdrawal', async () => {
    await authorizeAccount({
      email: account_ZCN.email,
      password: TransactionsHelperService.AccountPassword,
      agent: testData.agent,
    });

    await cryptoDeposit({
      account: account_ZCN,
      amount: new BigNumber('5000'),
      currency: 'ZCN',
      testData,
    });

    return await testData.agent
      .post('/transactions')
      .send({
        type: TransactionType.Withdrawal,
        withdrawal: {
          isActive: true,
          type: TransactionWithdrawalMethodType.CryptoWallet,
          currency: 'ZCN',
          amount: '3000',
          code: '000000',
          methodId: wallet_ZCN.id,
        },
      } as InCreateTransactionDTO)
      .expect(201);
  });

  afterAll(async () => {
    await testData.app.close();
  });
});