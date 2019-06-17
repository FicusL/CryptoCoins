import { Injectable } from '@nestjs/common';
import { AccountRepository, IAmountOffsetFilters } from '../../account/repository/account.repository';
import { AccountEntity } from '../../account/entitiy/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ICounterpartyTransactionInfo, TransactionRepository } from '../../transaction/repository/transaction.repository';
import { ITransactionGetFilters } from '../../transaction/abstract/transaction.get.filters.interface';
import { CounterpartyApiKeyEntity } from '../entity/counterparty.api-key.entity';
import { OutCounterpartyGenerateApiKeyDTO } from '../dto/out.counterparty.generate-api-key.dto';
import { CounterpartyApiKeyRepository } from '../repository/counterparty.api-key.repository';
import { CounterpartyApiKeyNotFoundException } from '../exceptions/counterparty-api-key-not-found.exception';
import { CurrencyPairRepository } from '../../transaction/repository/currency-pair.repository';
import { CurrencyPairEntity } from '../../transaction/entity/currency-pair.entity';
import { OutCounterpartyTransactionDTO } from '../dto/out.counterparty.transaction.dto';
import { CounterpartyEntity } from '../entity/counterparty.entity';
import { CounterpartyRepository } from '../repository/counterparty.repository';
import { CounterpartyNotFoundException } from '../exceptions/counterparty-not-found.exception';
import { MaximumLogoSizeExceededException } from '../exceptions/maximum-logo-size-exceeded.exception';
import { CounterpartyLogoNotSpecifiedException } from '../exceptions/counterparty-logo-not-specified.exception';
import { OutCounterpartyBalanceFromFeesDTO } from '../dto/out.counterparty.balance-from-fees.dto';
import { AccountService } from '../../account/service/account.service';
import { IDepositLimit, TransactionLimitsValidationService } from '../../transaction/service/transaction.limits-validation.service';
import { OutCounterpartyAccountDTO } from '../dto/out.counterparty.account.dto';
import { BigNumber } from 'bignumber.js';
import { KycStatus } from '../../kyc/const/kyc.status';
import { FileUtils } from '../../core/util/file-utils';
import { IFileElement } from '../../core/abstract/file.element.interface';
import { AccountType } from '../../account/const/account.type.enum';

@Injectable()
export class CounterpartyService {
  constructor(
    @InjectRepository(AccountRepository)
    protected readonly accountRepository: AccountRepository,

    @InjectRepository(TransactionRepository)
    protected readonly transactionRepository: TransactionRepository,

    @InjectRepository(CounterpartyApiKeyRepository)
    protected readonly counterpartyApiKeyRepository: CounterpartyApiKeyRepository,

    @InjectRepository(CurrencyPairRepository)
    protected readonly currencyPairRepository: CurrencyPairRepository,

    @InjectRepository(CounterpartyRepository)
    protected readonly counterpartyRepository: CounterpartyRepository,

    protected readonly transactionLimitsValidationService: TransactionLimitsValidationService,
    protected readonly accountService: AccountService,
  ) { }

  async setUrl(counterparty: CounterpartyEntity, url: string) {
    counterparty.url = url;

    return await this.counterpartyRepository.save(counterparty);
  }

  async setCounterpartyLetterTextFooter(counterparty: CounterpartyEntity, letterTextFooter: string) {
    counterparty.letterTextFooter = letterTextFooter;

    return await this.counterpartyRepository.save(counterparty);
  }

  async setEnableForWhiteListIPs(counterparty: CounterpartyEntity, enable: boolean) {
    counterparty.useWhiteListIPs = enable;

    return await this.counterpartyRepository.save(counterparty);
  }

  async addIPToWhiteList(counterparty: CounterpartyEntity, ipAddress: string) {
    const contains = counterparty.whiteListIPs.includes(ipAddress);

    if (!contains) {
      counterparty.whiteListIPs.push(ipAddress);

      counterparty = await this.counterpartyRepository.save(counterparty);
    }

    return counterparty;
  }

  async removeIPFromWhiteList(counterparty: CounterpartyEntity, ipAddress: string) {
    const contains = counterparty.whiteListIPs.includes(ipAddress);

    if (contains) {
      counterparty.whiteListIPs = counterparty.whiteListIPs.filter(address => address !== ipAddress);

      counterparty = await this.counterpartyRepository.save(counterparty);
    }

    return counterparty;
  }

  async getCounterpartyByAccountId(accountId: number): Promise<CounterpartyEntity> {
    const counterparty = await this.counterpartyRepository.getByAccountId(accountId);
    if (!counterparty) {
      throw new CounterpartyNotFoundException();
    }
    return counterparty;
  }

  async setStyles(counterparty: CounterpartyEntity, styles: object): Promise<CounterpartyEntity> {
    counterparty.styles = styles;

    return await this.counterpartyRepository.save(counterparty);
  }

  verifyFiles(files: IFiles) {
    if (!files || !files.logo || !files.logo[0]) {
      throw new CounterpartyLogoNotSpecifiedException();
    }

    const logo = files.logo[0];

    if (!logo.buffer || !logo.originalname || !logo.mimetype) {
      throw new CounterpartyLogoNotSpecifiedException();
    }

    const fileType = FileUtils.getFileType(logo);
    if (fileType.toLowerCase() !== 'image') {
      throw new CounterpartyLogoNotSpecifiedException();
    }
  }

  async setLogo(counterparty: CounterpartyEntity, files: IFiles) {
    const maxSizeMb = 1;
    const maxLogoSize = maxSizeMb * 1024 * 1024;

    const logo = files.logo[0];

    if (logo.buffer.length > maxLogoSize) {
      throw new MaximumLogoSizeExceededException(maxSizeMb);
    }

    counterparty.logoExt = FileUtils.getFileExtension(logo);
    counterparty.logo = logo.buffer;

    return await this.counterpartyRepository.save(counterparty);
  }

  protected getKycInfo(account: AccountEntity): { firstName?: string, lastName?: string } {
    if (!account.kyc) {
      return {};
    }

    let firstName: string | undefined;
    let lastName: string | undefined;

    if (account.type === AccountType.Natural) {
      if (account.kyc.lastSentSumSubInfo) {
        firstName = account.kyc.lastSentSumSubInfo.firstName;
        lastName = account.kyc.lastSentSumSubInfo.lastName;
      }
    } else if (account.type === AccountType.LegalEntity) {
      // TODO: add later
    }

    return { firstName, lastName };
  }

  protected generateAccountsDTOs(
    accounts: AccountEntity[],
    eurLimits: IDepositLimit[],
    transactionInfo: ICounterpartyTransactionInfo[],
  ): OutCounterpartyAccountDTO[] {
    const accountIdToLimit = new Map<number, BigNumber>();
    eurLimits.forEach(item => accountIdToLimit.set(item.account.id, item.limit));

    const accountIdToTransactionInfo = new Map<number, { transactionsEurAmount: BigNumber, feesEurAmount: BigNumber }>();
    transactionInfo.forEach(item => accountIdToTransactionInfo.set(item.account.id, { ...item }));

    return accounts.map(account => {
      const data = accountIdToTransactionInfo.get(account.id);
      const kycData = this.getKycInfo(account);

      return {
        accountId: account.id,
        email: account.email,
        kycStatus: account.kyc ? account.kyc.status : KycStatus.Unapproved,
        limitBalance: (accountIdToLimit.get(account.id) || new BigNumber(0)).toString(),
        transactionsAmount: (data ? data.transactionsEurAmount : new BigNumber(0)).toString(),
        feesAmount: (data ? data.feesEurAmount : new BigNumber(0)).toString(),
        firstName: kycData.firstName,
        lastName: kycData.lastName,
        registrationDate: account.registrationDate.toUTCString(),
      };
    });
  }

  async getAccounts(filters: IAmountOffsetFilters): Promise<OutCounterpartyAccountDTO[]> {
    const accounts = await this.accountRepository.getAccountsWithFilters(filters);

    const [ eurLimits, transactionInfo ] = await Promise.all([
      this.transactionLimitsValidationService.getRestOfDepositLimitInEURForAccounts(accounts),
      this.transactionRepository.getTransactionsInfo(accounts),
    ]);

    return this.generateAccountsDTOs(accounts, eurLimits, transactionInfo);
  }

  async getAccountsOfCounterparty(counterpartyAccount: AccountEntity, filters: IAmountOffsetFilters): Promise<OutCounterpartyAccountDTO[]> {
    const accounts = await this.accountRepository.getAccountsOfCounterpartyWithFilters(counterpartyAccount, filters);

    const [ eurLimits, transactionInfo ] = await Promise.all([
      this.transactionLimitsValidationService.getRestOfDepositLimitInEURForAccounts(accounts),
      this.transactionRepository.getCounterpartyTransactionsInfo(counterpartyAccount, accounts),
    ]);

    return this.generateAccountsDTOs(accounts, eurLimits, transactionInfo);
  }

  async getAccountsAmount(counterpartyAccount: AccountEntity) {
    return await this.accountRepository.getAmountAccountsOfCounterparty(counterpartyAccount);
  }

  async getBalanceFromFees(counterpartyAccount: AccountEntity): Promise<OutCounterpartyBalanceFromFeesDTO[]> {
    const result = await this.transactionRepository.getBalanceFromFees(counterpartyAccount);

    return result.map(item => ({
      balanceFromFees: item.balance.toString(),
      currency: item.currency,
    }));
  }

  async getTransactions(counterpartyAccount: AccountEntity, filters: ITransactionGetFilters): Promise<OutCounterpartyTransactionDTO[]> {
    filters.counterparty = { id: counterpartyAccount.id };
    const transactions = await this.transactionRepository.getAllTransactionWithFilters(filters);

    // preparing data
    const accountIdToEmail = new Map<number, string>();
    const accounts = await this.accountRepository.getAccountsOfCounterparty(counterpartyAccount);
    accounts.forEach(account => accountIdToEmail.set(account.id, account.email));

    const pairIdToPair = new Map<number, CurrencyPairEntity>();
    const pairs = await this.currencyPairRepository.getAll();
    pairs.forEach(pair => pairIdToPair.set(pair.id, pair));

    return transactions.map(item => {
      const pair = pairIdToPair.get(item.counterpartyPairId || -1) || ({} as CurrencyPairEntity);

      return {
        transactionId: item.id,
        wallet: item.counterpartyWallet || '',
        fee: item.counterpartyFee ? item.counterpartyFee.toNumber() : 0,
        amount: item.counterpartyAmount ? item.counterpartyAmount.toNumber() : 0,
        paymentAmount: item.counterpartyAmount.toString(),
        receiptAmount: item.withdrawal.amount.toString(),
        email: accountIdToEmail.get(item.accountId) || '',
        pairId: item.counterpartyPairId || -1,
        currencySell: pair.currencySell || '',
        currencyBuy: pair.currencyBuy || '',
      };
    });
  }

  async getAmountOfTransactions(counterpartyAccount: AccountEntity, filters: ITransactionGetFilters) {
    filters.counterparty = { id: counterpartyAccount.id };
    return await this.transactionRepository.getAmountEntities(filters);
  }

  async getApiKey(apiKeyId: number) {
    const apiKey = await this.counterpartyApiKeyRepository.getById(apiKeyId);
    if (!apiKey) {
      throw new CounterpartyApiKeyNotFoundException();
    }
    return apiKey;
  }

  async getApiKeys(counterpartyAccount: AccountEntity) {
    return await this.counterpartyApiKeyRepository.getByAccountId(counterpartyAccount.id);
  }

  async generateApiKeys(counterpartyAccount: AccountEntity, label: string) {
    let apiKey = new CounterpartyApiKeyEntity();
    const publicKey = CounterpartyApiKeyEntity.generatePublicKey();

    apiKey.account = counterpartyAccount;
    apiKey.label = label;
    apiKey.secretKey = CounterpartyApiKeyEntity.generateSecretKey();
    apiKey.hashOfPublicKey = publicKey.hash;
    apiKey.firstSymbolsOfPublicKey = publicKey.publicKey.substr(0, 7);

    apiKey = await this.counterpartyApiKeyRepository.save(apiKey);

    return new OutCounterpartyGenerateApiKeyDTO(apiKey, publicKey.publicKey);
  }

  async deleteApiKeys(apiKey: CounterpartyApiKeyEntity) {
    await this.counterpartyApiKeyRepository.deleteById(apiKey.id);
  }
}

interface IFiles {
  logo: IFileElement[];
}