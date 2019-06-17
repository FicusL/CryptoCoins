import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CounterpartyApiKeyRepository } from '../../repository/counterparty.api-key.repository';
import { CounterpartyApiKeyEntity } from '../../entity/counterparty.api-key.entity';
import { IncorrectHeadersExceptions } from '../../exceptions/incorrect-headers.exceptions';
import { IncorrectSignatureException } from '../../exceptions/incorrect-signature.exception';
import { CounterpartyApiKeyNotFoundException } from '../../exceptions/counterparty-api-key-not-found.exception';
import { AccountService } from '../../../account/service/account.service';
import { AccountType } from '../../../account/const/account.type.enum';
import { InCounterpartyV1CreateTransactionDTO } from '../../dto/v1/in/in.counterparty.v1.create-transaction.dto';
import { AccountEntity } from '../../../account/entitiy/account.entity';
import { OutCounterpartyV1CreateTransactionDTO } from '../../dto/v1/out/out.counterparty.v1.create-transaction.dto';
import { TransactionService } from '../../../transaction/service/transaction.service';
import { TransactionType } from '../../../transaction/const/transaction.type.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid/v4';
import * as crypto from 'crypto';
import { CurrencyPairRepository } from '../../../transaction/repository/currency-pair.repository';
import { CurrencyPairNotFoundException } from '../../exceptions/currency-pair-not-found.exception';
import { CurrencyPairNotActiveException } from '../../exceptions/currency-pair-not-active.exception';
import { BigNumber } from 'bignumber.js';
import { TransactionWithdrawalMethodType } from '../../../transaction/const/transaction.withdrawal-method.enum';
import { TransactionHTTPExceptions } from '../../../transaction/const/transaction.http.exceptions';
import { KycRepository } from '../../../kyc/repository/kyc.repository';
import { CounterpartyTransactionsStatuses } from '../../types/counterparty.transactions-statuses.enum';
import { KycStatus } from '../../../kyc/const/kyc.status';
import { TransactionStatus } from '../../../transaction/const/transaction.status.enum';
import { AccountExceptions } from '../../../account/const/account.exceptions';
import { TransactionRepository } from '../../../transaction/repository/transaction.repository';
import { OutCounterpartyV1TransactionHistoryDTO } from '../../dto/v1/out/out.counterparty.v1.transaction-history.dto';
import { KycEntity } from '../../../kyc/entity/kyc.entity';
import { CurrencyPairEntity } from '../../../transaction/entity/currency-pair.entity';
import { RatesServiceProviderBase } from '../../../rates/service/rates.service.provider.base';
import { createPair } from '../../../core/curencies/create-pair';
import { AccountRepository } from '../../../account/repository/account.repository';
import { OutCounterpartyV1StatusTransactionDTO } from '../../dto/v1/out/out.counterparty.v1.status-transaction.dto';
import { OutCounterpartyV1GetLimitDTO } from '../../dto/v1/out/out.counterparty.v1.get-limit.dto';
import { BadNonceException } from '../../exceptions/bad-nonce.exception';
import { ConfigsService } from '../../../core/service/configs.service';
import { TransactionDepositMethodType } from '../../../transaction/const/transaction.deposit-method.enum';
import { SettingsFacadeCurrenciesService } from '../../../settings/modules/curencies/service/settings.facade.currencies.service';
import { UnknownCurrencyException } from '../../exceptions/unknown-currency.exception';
import { TransactionLimitsValidationService } from '../../../transaction/service/transaction.limits-validation.service';
import { CounterpartyErrorCodes } from '../../const/counterparty.error-codes.enum';
import { TransactionCreatorService } from '../../../transaction/service/transaction-creator.service';

@Injectable()
export class CounterpartyV1Service {
  constructor(
    @InjectRepository(CounterpartyApiKeyRepository)
    protected readonly counterpartyApiKeyRepository: CounterpartyApiKeyRepository,

    @InjectRepository(CurrencyPairRepository)
    protected readonly currencyPairRepository: CurrencyPairRepository,

    @InjectRepository(KycRepository)
    protected readonly kycRepository: KycRepository,

    @InjectRepository(TransactionRepository)
    protected readonly transactionRepository: TransactionRepository,

    @InjectRepository(AccountRepository)
    private readonly accountRepository: AccountRepository,

    protected readonly accountService: AccountService,
    protected readonly transactionService: TransactionService,
    protected readonly transactionCreateService: TransactionCreatorService,
    protected readonly ratesService: RatesServiceProviderBase,
    protected readonly settingsFacadeCurrenciesService: SettingsFacadeCurrenciesService,
    protected readonly transactionLimitsValidationService: TransactionLimitsValidationService,
  ) { }

  // region Verify signature

  verifySignature(apiKeyEntity: CounterpartyApiKeyEntity, headers: any, endpoint: string, params: object) {
    const inHmacKey = headers['apiauth-key'];
    const inNonce = headers['apiauth-nonce'];
    const inSignature = headers['apiauth-signature'];

    if (!inHmacKey || !inNonce || !inSignature) {
      throw new IncorrectHeadersExceptions();
    }

    const secretKey = apiKeyEntity.secretKey;
    const encodeParams = this.generateEncode(params);
    const message = `${inNonce}${inHmacKey}${endpoint}${encodeParams}`;
    const signature = this.generateHmac(secretKey, message);

    if (signature.toUpperCase() !== inSignature) {
      throw new IncorrectSignatureException();
    }
  }

  protected generateEncode(params: object) {
    return Object
      .entries(params)
      .sort((left, right) => left[0] >= right[0] ? 1 : 0)
      .reduce((prev, item) => `${prev}${prev.length === 0 ? '' : '&'}${item[0]}=${item[1]}`, '');
  }

  protected generateHmac(key: string, message: string): string {
    return crypto.createHmac('sha256', key).update(message).digest('hex');
  }

  // endregion

  async updateNonce(apiKeyEntity: CounterpartyApiKeyEntity, request: any): Promise<CounterpartyApiKeyEntity> {
    const inNonce = request.headers['apiauth-nonce'];
    let nonce: bigint;

    try {
      nonce = BigInt(inNonce);
    } catch (e) {
      throw new BadNonceException();
    }

    if (nonce <= apiKeyEntity.lastNonce) {
      throw new BadNonceException();
    }

    apiKeyEntity.lastNonce = nonce;
    return await this.counterpartyApiKeyRepository.save(apiKeyEntity);
  }

  async getCounterpartyApiKey(headers: any): Promise<CounterpartyApiKeyEntity> {
    const inHmacKey = headers['apiauth-key'];

    if (!inHmacKey) {
      throw new IncorrectHeadersExceptions();
    }

    const hash = CounterpartyApiKeyEntity.createHash(inHmacKey);
    const apiKeyEntity = await this.counterpartyApiKeyRepository.getByPublicKeyHash(hash);
    if (!apiKeyEntity) {
      throw new CounterpartyApiKeyNotFoundException();
    }

    return apiKeyEntity;
  }

  protected generateCounterpartyURL(counterpartyActivationToken: string, counterpartyAccountId: number) {
    return `${ConfigsService.domainFrontEnd}/counterparties/${counterpartyAccountId}/transactions/${counterpartyActivationToken}`;
  }

  async createTransaction(
    apiKeyEntity: CounterpartyApiKeyEntity,
    dto: InCounterpartyV1CreateTransactionDTO,
  ): Promise<OutCounterpartyV1CreateTransactionDTO> {
    const counterpartyAccount = await this.accountService.getAccountById(apiKeyEntity.accountId);
    let account = await this.accountRepository.findByEmail(dto.email);

    if (!account) {
      account = await this.accountService.registerWithParams({
        email: dto.email,
        type: AccountType.Natural,
        password: `${uuid()}`,
        sendActivation: false,
        mustRegister: true,
      });
    }

    await this.accountRepository.addClientForCounterparty({
      accountId: account.id,
      counterpartyId: counterpartyAccount.id,
    });

    const counterpartyActivationToken = AccountEntity.generateCounterpartyActivationToken(dto.email);

    // creating transaction
    const pair = await this.getPairById(dto.pair_id);
    if (!pair.active) {
      return {
        url: undefined as any,
        transaction_id: undefined as any,
        error: CounterpartyErrorCodes.INACTIVE,
      };
    }

    const fromAmount = new BigNumber(dto.amount);

    const sellCurrencyType = await this.settingsFacadeCurrenciesService.getCurrencyType(pair.currencySell);
    if (!sellCurrencyType) {
      throw new UnknownCurrencyException(pair.currencySell);
    }

    try {
      const transaction = await this.transactionCreateService.createTransaction(account.id, {
        counterparty: counterpartyAccount,
        counterpartyActivationToken,
        counterpartyPair: pair,
        counterpartyAmount: new BigNumber(dto.amount),
        counterpartyFee: new BigNumber(dto.fee),
        counterpartyWallet: dto.wallet,

        type: dto.wallet ? TransactionType.DepositExchangeWithdrawal : TransactionType.DepositExchange,
        deposit: {
          currency: pair.currencySell,
          amount: fromAmount,
          paid: false,
          method: {
            type: TransactionDepositMethodType.RoyalPayBankCard,
          },
        },
        exchange: {
          from: {
            currency: pair.currencySell,
            amount: fromAmount,
          },
          to: {
            currency: pair.currencyBuy,
          },
        },
        withdrawal: {
          amount: fromAmount,
          currency: pair.currencyBuy,
          method: {
            type: TransactionWithdrawalMethodType.CounterpartyCryptoWallet,
            id: -1,
          },
        },
      });

      // generate result
      return {
        url: this.generateCounterpartyURL(counterpartyActivationToken, apiKeyEntity.accountId),
        transaction_id: transaction.id,
      };
    } catch (e) {

      if (e instanceof TransactionHTTPExceptions.PaymentLimitExceeded) {
        return {
          url: undefined as any,
          transaction_id: undefined as any,
          error: CounterpartyErrorCodes.LIMIT,
        };
      }

      throw e;
    }
  }

  protected getTransactionStatus(transactionStatus: TransactionStatus, kyc?: KycEntity) {
    // check by transaction status
    if (transactionStatus === TransactionStatus.Rejected) {
      return CounterpartyTransactionsStatuses.REJECTED;
    }

    if (transactionStatus === TransactionStatus.PaymentFailed) {
      return CounterpartyTransactionsStatuses.PAYMENT_FAILED;
    }

    if (transactionStatus === TransactionStatus.Completed) {
      return CounterpartyTransactionsStatuses.COMPLETED;
    }

    if (transactionStatus === TransactionStatus.Pending) {
      return CounterpartyTransactionsStatuses.PAYMENT_AWAITING;
    }

    // check by KYC status
    if (!kyc) {
      return CounterpartyTransactionsStatuses.KYC_AWAITING;
    }

    const approvedStatuses = [ KycStatus.Tier1Approved, KycStatus.Tier2Approved, KycStatus.Tier3Approved ];
    const kycUnapproved = !approvedStatuses.includes(kyc.status);
    if (kycUnapproved) {
      return CounterpartyTransactionsStatuses.KYC_PENDING;
    }

    throw new InternalServerErrorException();
  }

  protected async getPairById(pairId: number): Promise<CurrencyPairEntity> {
    const pair = await this.currencyPairRepository.getById(pairId);
    if (!pair) {
      throw new CurrencyPairNotFoundException();
    }

    return pair;
  }

  protected async getActivePairById(pairId: number): Promise<CurrencyPairEntity> {
    const pair = await this.getPairById(pairId);

    if (!pair.active) {
      throw new CurrencyPairNotActiveException();
    }

    return pair;
  }

  async statusTransaction(apiKeyEntity: CounterpartyApiKeyEntity, transactionId: number): Promise<OutCounterpartyV1StatusTransactionDTO> {
    const transaction = await this.transactionService.getTransactionById(transactionId);
    if (transaction.counterpartyId !== apiKeyEntity.accountId) {
      throw new TransactionHTTPExceptions.TransactionNotFound();
    }

    const account = await this.accountService.getAccountById(transaction.accountId);
    const kyc = await this.kycRepository.findByAccount(account);
    const status = this.getTransactionStatus(transaction.status, kyc);

    if (status === CounterpartyTransactionsStatuses.REJECTED) {
      return { status, reason: transaction.rejectReason };
    }

    return { status };
  }

  async transactionHistory(apiKeyEntity: CounterpartyApiKeyEntity, email: string): Promise<OutCounterpartyV1TransactionHistoryDTO[]> {
    const account = await this.accountService.findAccountByEmail(email);
    await this.verifyAccess(apiKeyEntity, account);

    const kyc = await this.kycRepository.findByAccount(account);

    const transaction = await this.transactionRepository.findByAccountsIds([ account.id ], {
      counterparty: { id: apiKeyEntity.accountId },
    });

    return transaction.map(item => ({
      pair_id: item.counterpartyPair ? item.counterpartyPair.id : -1,
      payment_amount: item.counterpartyAmount.toNumber(),
      receipt_amount: item.withdrawal.amount.toNumber(),
      fee: item.counterpartyFee.toNumber(),
      wallet: item.counterpartyWallet || undefined as any,
      url: this.generateCounterpartyURL(item.counterpartyActivationToken || '', apiKeyEntity.accountId),
      transaction_id: item.id,
      status: this.getTransactionStatus(item.status, kyc),
    }));
  }

  async getPairs() {
    return await this.currencyPairRepository.getAll();
  }

  protected async verifyAccess(apiKeyEntity: CounterpartyApiKeyEntity, account: AccountEntity) {
    const hasAccess = await this.accountRepository.accountCameFromCounterparty({
      accountId: account.id,
      counterpartyId: apiKeyEntity.accountId,
    });

    if (!hasAccess) {
      throw new AccountExceptions.AccountNotFound();
    }
  }

  async getLimit(apiKeyEntity: CounterpartyApiKeyEntity, email: string): Promise<OutCounterpartyV1GetLimitDTO[]> {
    const account = await this.accountService.findAccountByEmail(email);
    await this.verifyAccess(apiKeyEntity, account);

    const [ eurLimit, currencies ] = await Promise.all([
      this.transactionLimitsValidationService.getRestOfDepositLimitInEUR(account),
      await this.currencyPairRepository.getAllCurrencies(),
    ]);

    return this._getLimits(currencies, eurLimit);
  }

  protected _getLimits(currencies: string[], eurLimit: BigNumber): OutCounterpartyV1GetLimitDTO[] {
    const result: OutCounterpartyV1GetLimitDTO[] = [];

    for (const currency of currencies) {
      const pairString = createPair('EUR', currency);
      let rate = this.ratesService.rates.bid[pairString];

      if (currency === 'EUR') {
        rate = new BigNumber('1');
      }

      if (!rate) {
        continue;
      }

      const limitNumber = eurLimit.multipliedBy(rate).toNumber();

      result.push({
        currency,
        amount: isFinite(limitNumber) ? limitNumber : ('Infinity' as any),
      });
    }

    return result;
  }

  async getLimits(apiKeyEntity: CounterpartyApiKeyEntity): Promise<Record<string, Record<string, number>>[]> {
    const counterpartyAccount = await this.accountService.getAccountById(apiKeyEntity.accountId);
    const accounts = await this.accountRepository.getAccountsOfCounterparty(counterpartyAccount);

    const [ currencies, eurLimits ] = await Promise.all([
      this.currencyPairRepository.getAllCurrencies(),
      this.transactionLimitsValidationService.getRestOfDepositLimitInEURForAccounts(accounts),
    ]);

    const accountIdToEurLimit = new Map<number, BigNumber>();
    eurLimits.forEach(item => accountIdToEurLimit.set(item.account.id, item.limit));

    const result: Record<string, Record<string, number>>[] = [];

    for (const account of accounts) {
      const eurLimit = accountIdToEurLimit.get(account.id) || new BigNumber(0);
      const limits = this._getLimits(currencies, eurLimit);

      const rawLimits: Record<string, number> = {};
      for (const limitItem of limits) {
        rawLimits[limitItem.currency] = limitItem.amount;
      }

      result.push({ [account.email]: rawLimits });
    }

    return result;
  }

  async getPrice(pairId: number): Promise<number> {
    const pair = await this.getActivePairById(pairId);
    const pairString = createPair(pair.currencySell, pair.currencyBuy);

    const rates = this.ratesService.rates;
    const bid = rates.bid[pairString];

    if (!bid) {
      throw new InternalServerErrorException();
    }

    return (new BigNumber('1')).dividedBy(bid).toNumber();
  }
}