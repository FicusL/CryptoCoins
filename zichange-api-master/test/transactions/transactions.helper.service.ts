import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../../src/account/repository/account.repository';
import { KycRepository } from '../../src/kyc/repository/kyc.repository';
import { AccountEntity } from '../../src/account/entitiy/account.entity';
import { AccountType } from '../../src/account/const/account.type.enum';
import { KycEntity } from '../../src/kyc/entity/kyc.entity';
import { KycStatus } from '../../src/kyc/const/kyc.status';
import { InjectRepository } from '@nestjs/typeorm';
import { BankAccountRepository } from '../../src/requisite/repository/bank.account.repository';
import { CryptoWalletRepository } from '../../src/requisite/repository/crypto.wallet.repsoitory';
import { BankAccountEntity } from '../../src/requisite/entity/bank.account.entity';
import { CryptoWalletEntity } from '../../src/requisite/entity/crypto.wallet.entity';
import { createIdGenerator } from '../common/create-id-generator';
import { IndexRepository } from '../../src/index/repository/index.repository';
import { IndexEntity } from '../../src/index/entity/index.entity';
import { BigNumber } from 'bignumber.js';
import { IndexCurrencyEntity } from '../../src/index/entity/index-currency.entity';
import { IndexCurrencyRepository } from '../../src/index/repository/index-currency.repository';
import { TransactionStatus } from '../../src/transaction/const/transaction.status.enum';
import { TransactionRepository } from '../../src/transaction/repository/transaction.repository';

@Injectable()
export class TransactionsHelperService {
  public static readonly AccountPassword = 'password';

  constructor(
    @InjectRepository(AccountRepository)
    protected readonly accountRepository: AccountRepository,

    @InjectRepository(TransactionRepository)
    protected readonly transactionRepository: TransactionRepository,

    @InjectRepository(IndexRepository)
    protected readonly indexRepository: IndexRepository,

    @InjectRepository(IndexCurrencyRepository)
    protected readonly indexCurrencyRepository: IndexCurrencyRepository,

    @InjectRepository(KycRepository)
    protected readonly kycRepository: KycRepository,

    @InjectRepository(BankAccountRepository)
    protected readonly bankAccountRepository: BankAccountRepository,

    @InjectRepository(CryptoWalletRepository)
    protected readonly cryptoWalletRepository: CryptoWalletRepository,
  ) { }

  protected async createAccount(id: number): Promise<AccountEntity> {
    let account = new AccountEntity();

    account.email = `test_${id}@test.com`;
    account.type = AccountType.Natural;
    account.password = TransactionsHelperService.AccountPassword;
    account.isActivated = true;
    account.twoFaEnabled = true;
    account.btcWalletAddress = `btcWalletAddress_${id}`;
    account.ethWalletAddress = `ethWalletAddress_${id}`;
    account.ltcWalletAddress = `ltcWalletAddress_${id}`;
    account.zcnWalletAddress = `zcnWalletAddress_${id}`;

    account.xrpWalletAddress = `xrpWalletAddress_${id}`;
    account.bchWalletAddress = `bchWalletAddress_${id}`;
    account.xlmWalletAddress = `xlmWalletAddress_${id}`;
    account.dashWalletAddress = `dashWalletAddress_${id}`;
    account.zecWalletAddress = `zecWalletAddress_${id}`;
    account.bsvWalletAddress = `bsvWalletAddress_${id}`;
    account.btgWalletAddress = `btgWalletAddress_${id}`;

    account = await this.accountRepository.save(account);
    return account;
  }

  protected async createKyc(account: AccountEntity, id: number): Promise<KycEntity> {
    let kyc = new KycEntity();

    kyc.account = account;
    kyc.lastEditBy = account;
    kyc.status = KycStatus.Tier1Approved;
    kyc.fileName = `kyc_${id}.pdf`;

    kyc = await this.kycRepository.save(kyc);
    return kyc;
  }

  async setTransactionStatus(transactionId: number, status: TransactionStatus) {
    const transaction = await this.transactionRepository.getTransactionById(transactionId);

    if (!transaction) {
      return;
    }

    transaction.status = status;
    await this.transactionRepository.correctSave(transaction);
  }

  async createIndex(ticker: string) {
    let index = new IndexEntity();
    index.supply = new BigNumber('1');
    index.ticker = ticker;
    index.title = ticker;

    index = await this.indexRepository.saveWithoutCurrencies(index);

    const currencies = [ 'BTC', 'ETH', 'XRP', 'BCH', 'LTC' ];

    for (const currency of currencies) {
      const currencyEntity = new IndexCurrencyEntity();

      currencyEntity.index = index;
      currencyEntity.balance = new BigNumber('1');
      currencyEntity.currency = currency;

      await this.indexCurrencyRepository.save(currencyEntity);
    }
  }

  async createAccountForTestTransactions(): Promise<AccountEntity> {
    const id = getId();

    const account = await this.createAccount(id);
    const key = await this.createKyc(account, id);

    return account;
  }

  async createBankAccount(account: AccountEntity, currency: string): Promise<BankAccountEntity> {
    const id = getId();

    const bank = new BankAccountEntity();

    bank.label = `label_${id}`;
    bank.account = account;
    bank.bankName = `bankName_${id}`;
    bank.currency = currency;
    bank.IBAN = `IBAN_${id}`;
    bank.BIC = `BIC_${id}`;
    bank.recipientName = `recipientName_${id}`;

    return await this.bankAccountRepository.save(bank);
  }

  async createCryptoWallet(account: AccountEntity): Promise<CryptoWalletEntity> {
    const id = getId();

    const wallet = new CryptoWalletEntity();

    wallet.label = `label_${id}`;
    wallet.account = account;
    wallet.address = `address_${id}`;

    return await this.cryptoWalletRepository.save(wallet);
  }
}

const getId = createIdGenerator();