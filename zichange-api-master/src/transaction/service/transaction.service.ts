import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from '../../account/entitiy/account.entity';
import { AccountService } from '../../account/service/account.service';
import { TransactionType } from '../const/transaction.type.enum';
import { TransactionHTTPExceptions } from '../const/transaction.http.exceptions';
import { TransactionEntity } from '../entity/transaction.entity';
import { TransactionRepository } from '../repository/transaction.repository';
import { TransactionWithdrawalPartService } from './transaction-parts/transaction.withdrawal-part.service';
import { TransactionStatus } from '../const/transaction.status.enum';
import { TransactionWithdrawalEmbedded } from '../entity/embedded/transaction-parts/transaction.withdrawal.embedded';
import { BigNumber } from 'bignumber.js';
import { TransactionSortBy } from '../../realtime/const/transaction/transaction.sort.by.enum';
import { TransactionSortDirection } from '../../realtime/const/transaction/transaction.sort.direction.enum';
import { ITransactionWithdrawalUpdate } from '../abstract/operations/transaction.withdrawal-update.interface';
import { InTransactionChangeStatusDTO } from '../dto/in.transaction.change.status.dto';
import { TransactionWithdrawalMethodType } from '../const/transaction.withdrawal-method.enum';
import { TransactionReferralPartService } from './transaction-parts/transaction.referral-part.service';
import { TransactionExchangePartService } from './transaction-parts/transaction.exchange-part.service';
import { OutTransactionExtendedBalancesDTO } from '../dto/balances/out.transaction.extended-balances.dto';
import { CalculationsService } from '../../calculation/service/calculations.service';
import { RatesServiceProviderBase } from '../../rates/service/rates.service.provider.base';
import { createPair } from '../../core/curencies/create-pair';
import { ITransactionGetFilters } from '../abstract/transaction.get.filters.interface';
import { OutTransactionExtendedBalancesItemDTO } from '../dto/balances/out.transaction.extended-balances-item.dto';
import { allCoins, allCryptoCoins, allFiatCoins } from '../../core/const/coins';
import { BalanceRepository } from '../../balance/service/balance.repository';
import { IndexService } from '../../index/service/index.service';
import { IndexRatesService } from '../../index/service/index.rates.service';
import { IndexEntity } from '../../index/entity/index.entity';
import { TransactionChangeTransactionEvent } from '../events/impl/transaction.change-transaction.event';
import { EventBus } from '@nestjs/cqrs';

@Injectable()
export class TransactionService {
  constructor(
    private readonly eventBus: EventBus,

    @InjectRepository(TransactionRepository)
    private readonly transactionRepository: TransactionRepository,

    private readonly balanceRepository: BalanceRepository,

    private readonly transactionExchangePartService: TransactionExchangePartService,
    private readonly transactionWithdrawalPartService: TransactionWithdrawalPartService,
    private readonly transactionReferralPartService: TransactionReferralPartService,

    private readonly accountService: AccountService,
    private readonly ratesService: RatesServiceProviderBase,
    private readonly calculationsService: CalculationsService,
    private readonly indexService: IndexService,
    private readonly indexRatesService: IndexRatesService,
  ) { }

  // region Public methods

  // region Get data public methods

  public async getExtendedBalances(accountId: number, currencyForCalculations: string): Promise<OutTransactionExtendedBalancesDTO> {
    const filters: ITransactionGetFilters = {
      account: {
        id: accountId,
      },
      status: TransactionStatus.Completed,
    };

    const [ transactions, balances, indexEntities ] = await Promise.all([
      this.transactionRepository.getAllTransactionWithFilters(filters),
      this.getBalanceByAccountId(accountId),
      this.indexService.getAllIndexes(),
    ]);

    const indexes = indexEntities.map(index => index.ticker);

    const a = (currency: string, currencyForCalc: string) => this.getExchangeRates(currency, currencyForCalc);

    const b = (currency: string, currencyForCalc: string) => {
      const index = indexEntities.find(item => item.ticker === currency);
      if (!index) {
        return undefined;
      }
      return this.getExchangeRatesForIndexes(index, currencyForCalc);
    };

    const allCoinsItems = this.getExtendedBalancesItems(balances, allCoins, currencyForCalculations, transactions, a);
    const cryptoItems = this.getExtendedBalancesItems(balances, allCryptoCoins, currencyForCalculations, transactions, a);
    const fiatItems = this.getExtendedBalancesItems(balances, allFiatCoins, currencyForCalculations, transactions, a);
    const basketItems = this.getExtendedBalancesItems(balances, indexes, currencyForCalculations, transactions, b);

    let totalValue = new BigNumber('0');
    cryptoItems.forEach(item => totalValue = totalValue.plus(item.totalValue));
    fiatItems.forEach(item => totalValue = totalValue.plus(item.totalValue));
    basketItems.forEach(item => totalValue = totalValue.plus(item.totalValue));

    return {
      balances: allCoinsItems,
      crypto: cryptoItems,
      fiat: fiatItems,
      basket: basketItems,
      currency: currencyForCalculations,
      totalValue: totalValue.toFixed(8),
    };
  }

  async getTransactionById(transactionId: number) {
    const transaction = await this.transactionRepository.getTransactionById(transactionId);
    if (!transaction) {
      throw new TransactionHTTPExceptions.TransactionNotFound();
    }
    return transaction;
  }

  async getBalanceByAccountId(accountId: number): Promise<Map<string, BigNumber>> {
    const account = await this.accountService.getAccountById(accountId);
    return this.balanceRepository.getCurrenciesBalances(account.id);
  }

  async getTransactionsByAccountId(
    accountId: number,
    sort: { by: TransactionSortBy; direction: TransactionSortDirection },
    offset: number,
    amount: number,
  ): Promise<TransactionEntity[]> {
    return this.transactionRepository.findByAccountId(accountId, { sort, offset, amount });
  }

  async findReferralTransactionsByAccountId(accountId: number): Promise<TransactionEntity[]> {
    return await this.transactionRepository.findReferralTransactionsByAccountId(accountId);
  }

  async getReferralTransactionsBalanceByAccountId(accountId: number) {
    const transactions = await this.transactionRepository.findReferralTransactionsByAccountId(accountId);
    const result = new Map<string, BigNumber>();

    for (const transaction of transactions) {
      const currency = transaction.referralData.currency;

      const amount = result.get(currency) || new BigNumber(0);
      result.set(currency, amount.plus(transaction.referralData.amount));
    }

    return result;
  }

  async getTransactionByReferenceId(accountId: number, referenceId: string) {
    const id = TransactionEntity.getTransactionIdByReferenceId(referenceId);
    return await this.getTransactionById(id);
  }

  async getTransactionByReferenceIdOnly(referenceId: string) {
    const id = TransactionEntity.getTransactionIdByReferenceId(referenceId);
    return await this.getTransactionById(id);
  }

  // endregion

  // region Update data public methods

  async updateExchangeRate(transaction: TransactionEntity): Promise<TransactionEntity> {
    try {
      return await this._updateExchangeRate(transaction);
    } catch (e) {
      Logger.error(`${JSON.stringify(e.message)}. Transaction id: ${transaction.id}`, undefined, TransactionService.name);

      const oldTransaction = new TransactionEntity(transaction);

      transaction.status = TransactionStatus.Rejected;
      transaction.rejectReason = 'Transaction exchange rate can not be updated';

      transaction = await this.transactionRepository.correctSave(transaction);

      this.eventBus.publish(new TransactionChangeTransactionEvent({
        oldTransaction,
        newTransaction: transaction,
      }));

      return transaction;
    }
  }

  private async _updateExchangeRate(transaction: TransactionEntity): Promise<TransactionEntity> {
    const oldTransaction = new TransactionEntity();

    if (transaction.status !== TransactionStatus.Pending) {
      throw new TransactionHTTPExceptions.TransactionMustBePending();
    }

    const exchangeActive = transaction.exchange.isActive;
    const withdrawalActive = transaction.withdrawal.isActive;

    if (!exchangeActive) {
      throw new TransactionHTTPExceptions.ExchangeRateCantBeUpdated();
    }

    const availableTypes: TransactionType[] = [
      TransactionType.DepositExchange,
      TransactionType.DepositExchangeWithdrawal,
      TransactionType.Exchange,
      TransactionType.ExchangeWithdrawal,
    ];

    if (!availableTypes.includes(transaction.type)) {
      throw new TransactionHTTPExceptions.ExchangeRateCantBeUpdated();
    }

    const account = await this.accountService.getAccountById(transaction.accountId);
    const exchangePart = transaction.exchange;
    const isB2BTransaction = !!transaction.counterpartyId;

    transaction.exchange = await this.transactionExchangePartService.createExchangeTransactionPart(account, transaction.type, {
      from: {
        amount: exchangePart.from.amount,
        currency: exchangePart.from.currency,
      },
      to: {
        currency: exchangePart.to.currency,
      },
    }, {
      isB2BTransaction,
      counterpartyFee: transaction.counterpartyFee,
      balanceCorrection: exchangePart.from.amount,
    });

    if (withdrawalActive) {
      transaction.withdrawal = await this.transactionWithdrawalPartService.createWithdrawalTransactionPart(account, {
        code: '', // not validate
        method: {
          type: transaction.withdrawal.method.type,
          id: this.getWithdrawalMethodId(transaction),
        },
        amount: transaction.exchange.to.amount,
        currency: transaction.withdrawal.currency,
      }, {
        verify2FA: false,
        isB2BTransaction,
        balanceCorrection: transaction.exchange.to.amount,
      });
    }

    transaction = await this.transactionRepository.correctSave(transaction);

    this.eventBus.publish(new TransactionChangeTransactionEvent({
      oldTransaction,
      newTransaction: transaction,
    }));

    return transaction;
  }

  async updateTransactionWithdrawal(params: ITransactionWithdrawalUpdate): Promise<TransactionEntity> {
    const { referenceId, accountId, method, code } = params;

    const [ account, transaction ] = await Promise.all([
      this.accountService.getAccountById(accountId),
      this.getTransactionByReferenceId(accountId, referenceId),
    ]);

    const oldTransaction = new TransactionEntity(transaction);

    const canChangeWithdrawal = (
      (transaction.type === TransactionType.Exchange && transaction.status === TransactionStatus.Pending) ||
      (transaction.type === TransactionType.Withdrawal && transaction.status === TransactionStatus.Pending) ||
      (transaction.type === TransactionType.ExchangeWithdrawal && transaction.status === TransactionStatus.Pending) ||
      (transaction.type === TransactionType.DepositExchangeWithdrawal && transaction.status === TransactionStatus.Pending)
    );

    if (!canChangeWithdrawal) {
      throw new TransactionHTTPExceptions.WithdrawalCantBeChanged();
    }

    const isWithdrawalActive = transaction.withdrawal && transaction.withdrawal.isActive;
    const isExchangeActive = transaction.exchange && transaction.exchange.isActive;
    const isDepositActive = transaction.deposit && transaction.deposit.isActive;

    if (!isWithdrawalActive && !isExchangeActive) {
      throw new TransactionHTTPExceptions.WithdrawalCantBeChanged();
    }

    if (isWithdrawalActive) {
      if (method.id === -1) {
        // TODO: think about it later: TransactionType.DepositExchangeWithdrawal ?
        if (transaction.type !== TransactionType.ExchangeWithdrawal) {
          throw new TransactionHTTPExceptions.WithdrawalCantBeChanged();
        }

        transaction.withdrawal = new TransactionWithdrawalEmbedded({ isActive: false });
        transaction.type = TransactionType.Exchange;
      } else {
        const params_ = {
          ...transaction.withdrawal,
          method: {
            ... transaction.withdrawal.method,
            id: method.id,
            type: method.type,
          },
          code,
        };

        const options_ = {
          balanceCorrection: transaction.withdrawal.amount.multipliedBy(2),
          verify2FA: true,
          checkLimits: true,
          isB2BTransaction: !!transaction.counterparty,
        };

        transaction.withdrawal =
          await this.transactionWithdrawalPartService.createWithdrawalTransactionPart(account, params_, options_);
      }
    } else if (isExchangeActive) {
      if (method.id === -1) { // Hotfix
        return transaction;
      }

      const { amount: toAmount, currency: toCurrency } = transaction.exchange.to;

      const params_ = {
        method: {
          id: method.id,
          type: method.type,
        },
        amount: toAmount,
        currency: toCurrency,
        code,
      };

      const options_ = {
        balanceCorrection: toAmount,
        verify2FA: true,
        checkLimits: true,
        isB2BTransaction: !!transaction.counterparty,
      };

      transaction.withdrawal =
        await this.transactionWithdrawalPartService.createWithdrawalTransactionPart(account, params_, options_);

      transaction.type = isDepositActive ? TransactionType.DepositExchangeWithdrawal : TransactionType.ExchangeWithdrawal;
    }

    try {
      const savedTransaction = await this.transactionRepository.correctSave(transaction);

      this.eventBus.publish(new TransactionChangeTransactionEvent({
        oldTransaction,
        newTransaction: savedTransaction,
      }));

      return savedTransaction;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async cancelPendingTransaction(transaction: TransactionEntity, accountId: number) {
    if (transaction.accountId !== accountId) {
      throw new TransactionHTTPExceptions.TransactionNotFound();
    }

    if (transaction.status !== TransactionStatus.Pending) {
      throw new TransactionHTTPExceptions.TransactionMustBePending();
    }

    try {
      await this.transactionRepository.delete(transaction.id);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async processDeleteBankAccount(bankAccountId: number) {
    const transactions = await this.transactionRepository.findByBankAccountId(bankAccountId);
    await this.handleDeleteWithdrawalAddress(transactions, 'Withdrawal bank account will be deleted');
    await this.transactionRepository.removeBankAccountFromTransactions(bankAccountId);
  }

  async processDeleteCryptoWallet(cryptoWalletId: number) {
    const transactions = await this.transactionRepository.findByCryptoWalletId(cryptoWalletId);
    await this.handleDeleteWithdrawalAddress(transactions, 'Withdrawal wallet will be deleted');
    await this.transactionRepository.removeCryptoWalletFromTransactions(cryptoWalletId);
  }

  async changeTransactionStatusByTransactionId(
    transactionId: number, dto: InTransactionChangeStatusDTO, adminAccount?: AccountEntity,
  ): Promise<TransactionEntity> {
    let transaction = await this.getTransactionById(transactionId);
    const oldTransaction = new TransactionEntity(transaction);

    const depositTypes = [ TransactionType.Deposit, TransactionType.DepositExchange, TransactionType.DepositExchangeWithdrawal ];
    const transactionHasDepositPart = depositTypes.includes(transaction.type);

    if (dto.status === TransactionStatus.PaymentFailed && !transactionHasDepositPart) {
      throw new TransactionHTTPExceptions.IncompatibleTransactionType();
    }

    transaction.status = dto.status;
    if (dto.rejectReason) {
      transaction.rejectReason = dto.rejectReason;
    }

    if (adminAccount) {
      transaction.edit.editAccount = adminAccount;
    }

    const saveWithdrawalMethodToJSON =
      dto.status === TransactionStatus.Completed &&
      transaction.withdrawal &&
      transaction.withdrawal.isActive;

    if (saveWithdrawalMethodToJSON) {
      this.fillWithdrawalMethodJSON(transaction);
    }

    try {
      transaction = await this.transactionRepository.correctSave(transaction);
    } catch (e) {
      throw new InternalServerErrorException();
    }

    this.eventBus.publish(new TransactionChangeTransactionEvent({
      oldTransaction,
      newTransaction: transaction,
    }));

    await this.transactionReferralPartService.createReferralTransaction(transaction);

    return transaction;
  }

  // endregion

  // endregion

  // region Private methods

  private getTotalValue(currencyForCalculations: string, totalValueInEur: BigNumber) {
    const isEurForCalculation = currencyForCalculations === 'EUR';
    const pairForCalculation = createPair('EUR', currencyForCalculations);
    const exchangeEurRateForCalculation = isEurForCalculation ? new BigNumber('1') : this.ratesService.rates.median[pairForCalculation];
    return totalValueInEur.multipliedBy(exchangeEurRateForCalculation);
  }

  private getWithdrawalMethodId(transaction: TransactionEntity): number {
    const method = transaction.withdrawal.method;

    if (method.bankAccount) {
      return method.bankAccount.id;
    }

    if (method.cryptoWallet) {
      return method.cryptoWallet.id;
    }

    return -1;
  }

  private fillWithdrawalMethodJSON(transaction: TransactionEntity) {
    const { type, bankAccount, cryptoWallet } = transaction.withdrawal.method;

    const isBankAccount = type === TransactionWithdrawalMethodType.BankAccount;
    const isCryptoWallet = type === TransactionWithdrawalMethodType.CryptoWallet;

    if (isBankAccount && bankAccount) {
      transaction.withdrawal.method.method = {
        type: TransactionWithdrawalMethodType.BankAccount,
        data: bankAccount,
      };
    } else if (isCryptoWallet && cryptoWallet) {
      transaction.withdrawal.method.method = {
        type: TransactionWithdrawalMethodType.CryptoWallet,
        data: {
          label: cryptoWallet.label,
          address: cryptoWallet.address,
          currency: transaction.withdrawal.currency,
        },
      };
    }
  }

  private async handleDeleteWithdrawalAddress(transactions: TransactionEntity[], rejectReason: string) {
    const transactionIdToOldTransaction = new Map<number, TransactionEntity>();
    transactions.forEach(transaction => transactionIdToOldTransaction.set(transaction.id, new TransactionEntity(transaction)));

    for (const transaction of transactions) {
      if (transaction.status === TransactionStatus.Completed) {
        continue;
      }

      if (!transaction.withdrawal || !transaction.withdrawal.isActive) {
        continue;
      }

      if (transaction.type === TransactionType.ExchangeWithdrawal) {
        transaction.type = TransactionType.Exchange;
        transaction.withdrawal = new TransactionWithdrawalEmbedded({ isActive: false });
      } else if (transaction.type === TransactionType.Withdrawal) {
        transaction.status = TransactionStatus.Rejected;
        transaction.rejectStatus = TransactionStatus.Rejected;
        transaction.rejectReason = rejectReason;
      } else if ( transaction.type === TransactionType.DepositExchangeWithdrawal) {
        transaction.type = TransactionType.DepositExchange;
        transaction.withdrawal = new TransactionWithdrawalEmbedded({ isActive: false });
      }
    }

    try {
      transactions = await this.transactionRepository.correctSaveArray(transactions);
    } catch (e) {
      throw new InternalServerErrorException();
    }

    for (const transaction of transactions) {
      this.eventBus.publish(new TransactionChangeTransactionEvent({
        oldTransaction: transactionIdToOldTransaction.get(transaction.id)!,
        newTransaction: transaction,
      }));
    }
  }

  private getExtendedBalancesItems(
    balances: Map<string, BigNumber>,
    currencies: string[],
    currencyForCalculations: string,
    transactions: TransactionEntity[],
    getRates: GetExchangeRatesFunction,
  ) {
    const resultItems: OutTransactionExtendedBalancesItemDTO[] = [];

    for (const currency of currencies) {
      const balance = balances.get(currency) || new BigNumber('0');
      const item = this.getExtendedBalanceItem(currency, currencyForCalculations, balance, transactions, getRates);

      if (item) {
        resultItems.push(item);
      }
    }

    return resultItems;
  }

  private getExchangeRates(currency: string, currencyForCalculations: string): IExchangeRates | undefined {
    const pair = createPair(currency, 'EUR');
    const isEur = currency === 'EUR';
    const exchangeEurRate = isEur ? new BigNumber('1') : this.ratesService.rates.median[pair];
    const rateForPrice = this.ratesService.getRate('EUR', currencyForCalculations);
    const exchangePercentDelta = this.ratesService.rates.change[pair] || new BigNumber('0');

    if (!exchangeEurRate || !exchangePercentDelta || !rateForPrice) {
      return undefined;
    }

    return {
      exchangeEurRate,
      exchangePercentDelta,
      rateForPrice,
    };
  }

  private getExchangeRatesForIndexes(index: IndexEntity, currencyForCalculations: string): IExchangeRates | undefined {
    const exchangeEurRate = this.indexRatesService.getPriceIndexInUER(index);
    const rateForPrice = this.ratesService.getRate('EUR', currencyForCalculations);
    const exchangePercentDelta = new BigNumber('0'); // TODO: how receive?

    if (!exchangeEurRate || !exchangePercentDelta || !rateForPrice) {
      return undefined;
    }

    return {
      exchangeEurRate,
      exchangePercentDelta,
      rateForPrice,
    };
  }

  private getExtendedBalanceItem(
    currency: string,
    currencyForCalculations: string,
    balance: BigNumber,
    transactions: TransactionEntity[],
    getRates: GetExchangeRatesFunction,
  ): OutTransactionExtendedBalancesItemDTO | undefined {
    const rates = getRates(currency, currencyForCalculations);
    if (!rates) {
      // Logger.warn(`Rate receipt error for currency: ${currency}`, TransactionService.name);
      return undefined;
    }

    const arrays = this.calculationsService.getArraysForAveragePurchasePrice(transactions, currency, rates.rateForPrice);

    const averagePurchasePrice = this.calculationsService.averagePurchasePrice(arrays.deposit, arrays.withdrawal);
    const unrealizedProfitLoss =
      this.calculationsService.unrealizedProfitLoss(balance, rates.exchangeEurRate.multipliedBy(rates.rateForPrice), averagePurchasePrice);
    const totalValueInEur = balance.multipliedBy(rates.exchangeEurRate);

    const totalValue = this.getTotalValue(currencyForCalculations, totalValueInEur);

    return {
      currency,
      balance: balance.toString(),
      exchangeEurRate: rates.exchangeEurRate.toFixed(8),
      exchangePercentDelta: rates.exchangePercentDelta.toFixed(8),
      totalValue: totalValue.toFixed(8),
      averagePurchasePrice: averagePurchasePrice.toFixed(8),
      unrealizedProfitLoss: unrealizedProfitLoss.toFixed(8),
    };
  }

  // endregion
}

interface IExchangeRates {
  exchangeEurRate: BigNumber;
  rateForPrice: BigNumber;
  exchangePercentDelta: BigNumber;
}

type GetExchangeRatesFunction = (currency: string, currencyForCalculations: string) => IExchangeRates | undefined;