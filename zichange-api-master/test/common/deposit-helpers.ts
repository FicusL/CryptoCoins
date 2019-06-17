import { BigNumber } from 'bignumber.js';
import { AccountEntity } from '../../src/account/entitiy/account.entity';
import { ITestData } from './types/test-data.interface';
import { TransactionType } from '../../src/transaction/const/transaction.type.enum';
import { TransactionStatus } from '../../src/transaction/const/transaction.status.enum';
import { TransactionDepositMethodType } from '../../src/transaction/const/transaction.deposit-method.enum';
import { TransactionCreatorService } from '../../src/transaction/service/transaction-creator.service';

interface IParams {
  currency: string;
  amount: BigNumber;
  account: AccountEntity;
  testData: ITestData;
}

async function deposit(data: IParams, methodType: TransactionDepositMethodType) {
  const transactionService = data.testData.moduleFixture.get<TransactionCreatorService>(TransactionCreatorService);

  return await transactionService.createTransaction(data.account.id, {
    type: TransactionType.Deposit,
    status: TransactionStatus.Completed,
    deposit: {
      paid: true,
      amount: data.amount,
      currency: data.currency,
      method: {
        type: methodType,
      },
    },
  });
}

export async function cryptoDeposit(data: IParams) {
  return await deposit(data, TransactionDepositMethodType.CryptoWallet);
}

export async function fiatDeposit(data: IParams) {
  return await deposit(data, TransactionDepositMethodType.BankAccount);
}