import { Injectable } from '@nestjs/common';
import { AccountEntity } from '../../../account/entitiy/account.entity';
import { TransactionFeePartService } from './transaction.fee-part.service';
import { TransactionPartType } from '../../../core/const/core.transaction-part-type.enum';
import { SettingsFacadeCurrenciesService } from '../../../settings/modules/curencies/service/settings.facade.currencies.service';
import { TransactionHTTPExceptions } from '../../const/transaction.http.exceptions';
import { ITransactionCreateExchangeEmbedded } from '../../abstract/operations/transaction-parts/transaction.create.exchange-embedded.interface';
import { BigNumber } from 'bignumber.js';
import { CurrencyType } from '../../../core/const/core.currency-type.enum';
import { TransactionExchangeEmbedded } from '../../entity/embedded/transaction-parts/transaction.exchange.embedded';
import { TransactionOperationDataEmbedded } from '../../entity/embedded/transaction-parts/transaction-operation.data.embedded';
import { createPair } from '../../../core/curencies/create-pair';
import { TransactionAmountsService } from '../transaction.amounts.service';
import { RatesServiceProviderBase } from '../../../rates/service/rates.service.provider.base';
import { BalanceRepository } from '../../../balance/service/balance.repository';
import { TransactionType } from '../../const/transaction.type.enum';
import { IndexRatesService } from '../../../index/service/index.rates.service';
import { IndexEntity } from '../../../index/entity/index.entity';
import { IndexService } from '../../../index/service/index.service';

// TODO: uncomment

@Injectable()
export class TransactionExchangePartService {
  constructor(
    private readonly balanceRepository: BalanceRepository,

    private readonly transactionFeePartService: TransactionFeePartService,
    private readonly transactionAmountsService: TransactionAmountsService,

    private readonly settingsFacadeCurrenciesService: SettingsFacadeCurrenciesService,
    private readonly exchangeService: RatesServiceProviderBase,

    private readonly indexRatesService: IndexRatesService,
    private readonly indexService: IndexService,
  ) { }

  // region Public methods

  async createExchangeTransactionPart(
    account: AccountEntity,
    type: TransactionType,
    params: ITransactionCreateExchangeEmbedded,
    options: {
      balanceCorrection: BigNumber | undefined,
      counterpartyFee: BigNumber,
      isB2BTransaction: boolean,
    },
  ): Promise<TransactionExchangeEmbedded> {
    const { from, to } = params;

    const { amount: fromAmount, currency: fromCurrency } = from;
    const { currency: toCurrency } = to;

    const pair = createPair(fromCurrency, toCurrency);

    let partType = TransactionPartType.Exchange;
    if (type === TransactionType.BuyBasket) {
      partType = TransactionPartType.BuyBasket;
    }
    if (type === TransactionType.SellBasket) {
      partType = TransactionPartType.SellBasket;
    }

    const [ currencyTypesMapping, allIndexes, balances, fee ] = await Promise.all([
      this.getCurrencyTypes(),
      this.indexService.getAllIndexes(),

      this.balanceRepository.getCurrenciesBalances(account.id),
      this.transactionFeePartService.getFeeEmbedded(partType, pair, fromAmount, {
        isB2BTransaction: options.isB2BTransaction,
      }),
    ]);

    const fromCurrencyType = currencyTypesMapping.get(fromCurrency);
    const toCurrencyType = currencyTypesMapping.get(toCurrency);

    const badFromCurrency =
      !fromCurrencyType ||
      (type === TransactionType.BuyBasket && fromCurrencyType === CurrencyType.Index) ||
      (type === TransactionType.SellBasket && fromCurrencyType !== CurrencyType.Index);

    if (badFromCurrency) {
      throw new TransactionHTTPExceptions.BadFromCurrency(fromCurrency);
    }

    const badToCurrency =
      !toCurrencyType ||
      (type === TransactionType.BuyBasket && toCurrencyType !== CurrencyType.Index) ||
      (type === TransactionType.SellBasket && toCurrencyType === CurrencyType.Index);

    if (badToCurrency) {
      throw new TransactionHTTPExceptions.BadToCurrency(toCurrency);
    }

    const isFromAmountInvalid = fromAmount.isNaN() || !fromAmount.isPositive();
    if (isFromAmountInvalid) {
      throw new TransactionHTTPExceptions.BadFromAmount();
    }

    const isPairInvalid = fromCurrencyType === toCurrencyType;
    if (isPairInvalid) {
      throw new TransactionHTTPExceptions.BadPair(pair);
    }

    this.transactionAmountsService.validateAmount(fromAmount, partType, fromCurrency, {});

    let balanceCorrection = new BigNumber(0);
    if (options.balanceCorrection && !options.balanceCorrection.isNaN()) {
      balanceCorrection = options.balanceCorrection;
    }

    const balance = (balances.get(fromCurrency) || new BigNumber(0)).plus(balanceCorrection);
    const isNotEnoughBalance = balance.isLessThan(fromAmount);
    if (isNotEnoughBalance) {
      throw new TransactionHTTPExceptions.BalanceLessThanPaymentAmount();
    }

    let rate = new BigNumber(NaN);
    let index: IndexEntity | undefined;

    if (type === TransactionType.SellBasket) {
      index = await this.indexRatesService.getIndexByTicker(fromCurrency);
      rate = this.indexRatesService.getPriceIndex(index, toCurrency);
    } else if (type === TransactionType.BuyBasket) {
      index = await this.indexRatesService.getIndexByTicker(toCurrency);
      rate = this.indexRatesService.getPriceIndex(index, fromCurrency);
      rate = (new BigNumber('1')).dividedBy(rate);
    } else {
      const rates = this.exchangeService.rates;
      rate = toCurrencyType === CurrencyType.Crypto ? rates.bid[pair] : rates.ask[pair];
    }

    this.validateRate(pair, rate);

    const totalFee = fee.amount.plus(options.counterpartyFee);
    // See the README
    if (fromAmount.isLessThan(totalFee)) {
      throw new TransactionHTTPExceptions.AmountLessThanFee();
    }

    const toAmount = fromAmount.minus(totalFee).multipliedBy(rate);

    const toAmountEUREquivalent =
      ((toCurrencyType === CurrencyType.Index) && index)
        ? this.indexRatesService.getEUREquivalent(index, toAmount)
        : this.exchangeService.getEUREquivalent(toCurrency, toAmount);

    const fromAmountEUREquivalent =
      ((fromCurrencyType === CurrencyType.Index) && index)
        ? this.indexRatesService.getEUREquivalent(index, fromAmount)
        : this.exchangeService.getEUREquivalent(fromCurrency, fromAmount);

    const fromIndex: IndexEntity | undefined =
      (fromCurrencyType === CurrencyType.Index)
        ? allIndexes.find(indexItem => indexItem.ticker === fromCurrency)
        : undefined;

    const toIndex: IndexEntity | undefined =
      (toCurrencyType === CurrencyType.Index)
        ? allIndexes.find(indexItem => indexItem.ticker === toCurrency)
        : undefined;

    return new TransactionExchangeEmbedded({
      isActive: true,

      from: new TransactionOperationDataEmbedded({ amount: fromAmount, currency: fromCurrency }),
      to: new TransactionOperationDataEmbedded({ amount: toAmount, currency: toCurrency }),

      fee,
      rate,

      fromIndex,
      toIndex,

      toAmountEUREquivalent,
      fromAmountEUREquivalent,
    });
  }

  // endregion

  // region Private methods

  private async getCurrencyTypes(): Promise<Map<string, CurrencyType>> {
    const result = new Map<string, CurrencyType>();

    const [ cryptoCurrencies, fiatCurrencies, indexesCurrencies ] = await Promise.all([
      this.settingsFacadeCurrenciesService.getCryptoCurrencies(),
      this.settingsFacadeCurrenciesService.getFiatCurrencies(),
      this.indexService.getAllIndexes(),
    ]);

    cryptoCurrencies.forEach(currency => result.set(currency, CurrencyType.Crypto));
    fiatCurrencies.forEach(currency => result.set(currency, CurrencyType.Fiat));
    indexesCurrencies.forEach(currency => result.set(currency.ticker, CurrencyType.Index));

    return result;
  }

  private validateRate(pair: string, rate: BigNumber | undefined) {
    const isInvalidRate = !rate || rate.isNaN() || !rate.isPositive();
    if (isInvalidRate) {
      throw new TransactionHTTPExceptions.BadPair(pair);
    }
  }

  // endregion
}