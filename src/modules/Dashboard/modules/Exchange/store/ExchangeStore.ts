import { inject, injectable } from 'inversify';
import { action, computed, observable } from 'mobx';
import { BigNumber } from 'bignumber.js';
import { LoaderStore } from '../../../../Shared/modules/Loader/store/LoaderStore';
import { AxiosWrapper } from '../../../../Shared/services/AxiosWrapper';
import { AxiosResponse } from 'axios';
import { FacadeCurrenciesStore } from '../../../../Shared/modules/Currencies/store/FacadeCurrenciesStore';
import { IInTransactionCreateDTO } from '../../../../Shared/modules/Transactions/abstract/dto/IInTransactionCreateDTO';
import { ExchangeRatesStore } from '../../../../Shared/modules/Rates/store/ExchangeRatesStore';
import { IOutTransactionDTO } from '../../../../Shared/modules/Transactions/abstract/dto/IOutTransactionDTO';
import { ExchangeFields } from '../const/ExchangeFields';
import { CurrencyType } from '../../../../Shared/modules/Currencies/const/CurrencyType';
import { CurrencyTypeFractionLength } from '../../../../Shared/modules/Currencies/const/CurrencyTypeFractionLength';
import { ExchangeMinAmountsStore } from '../../../../Shared/modules/MinAmounts/store/concrete/ExchangeMinAmountsStore';
import { IInCreateTransactionExchangePartDTO } from '../../../../Shared/modules/Transactions/abstract/dto/in.parts/IInCreateTransactionExchangePartDTO';
import { TransactionType } from '../../../../Shared/modules/Transactions/const/TransactionType';
import { Fees } from '../../../../Shared/services/Fees/Fees';
import { WalletStore } from './WalletStore';

@injectable()
export class ExchangeStore {
  protected static readonly VALIDATE_TRANSACTION_TASK = 'CHECK_LIMITS_TASK';
  protected static readonly PLACE_ORDER_TASK = 'PLACE_ORDER_TASK';

  @inject(LoaderStore)
  private readonly loaderStore: LoaderStore;

  @inject(AxiosWrapper)
  private readonly axiosWrapper: AxiosWrapper;

  @inject(WalletStore)
  private readonly walletStore: WalletStore;

  @inject(FacadeCurrenciesStore)
  private readonly facadeCurrenciesStore: FacadeCurrenciesStore;

  @inject(ExchangeRatesStore)
  private readonly exchangesRatesStore: ExchangeRatesStore;

  @inject(ExchangeMinAmountsStore)
  private readonly exchangeMinAmountsStore: ExchangeMinAmountsStore;

  @inject(Fees)
  fees: Fees;

  @observable lastChangedField = ExchangeFields.From;

  @observable fromAmountRaw: string = '0';
  @observable fromCurrency: string = 'EUR';
  @observable fromError: string;

  @observable toAmountRaw: string = '0';
  @observable toCurrency: string = 'BTC';
  @observable toError: string;

  @observable isSwapped: boolean = false;

  @observable minAmount: BigNumber = new BigNumber(0);
  @observable feeAmount: BigNumber = new BigNumber(0);

  private readonly feeCoef = new BigNumber(0.007);

  @computed
  get currentFrontPair() : string | undefined {
    return `${this.cryptoCurrency}/EUR`;
  }

  @computed
  get currentBackendPair() : string | undefined {
    return this.isSwapped ? this.pair : `${this.toCurrency}-${this.fromCurrency}`;
  }

  @computed
  get cryptoCurrency() : string | undefined {
    return !this.isSwapped ? this.toCurrency : this.fromCurrency;
  }

  //#region Rates properties (bid/ask/change)
  @computed
  get bidRates() {
    return this.exchangesRatesStore.bid;
  }

  @computed
  get askRates() {
    return this.exchangesRatesStore.ask;
  }

  @computed
  get changeRates() {
    return this.exchangesRatesStore.change;
  }
  //#endregion

  //#region Amount computed helpers (from/to)
  @computed
  get fromAmount(): BigNumber {
    return new BigNumber(this.fromAmountRaw || '0');
  }

  @computed
  get fromCurrencyType(): CurrencyType | undefined {
    return this.facadeCurrenciesStore.getCurrencyType(this.fromCurrency);
  }

  @computed
  get fromAmountString(): string {
    return this.fromAmount.toFixed(CurrencyTypeFractionLength[this.fromCurrencyType]);
  }

  @computed
  get toAmount(): BigNumber {
    return new BigNumber(this.toAmountRaw || '0');
  }

  @computed
  get toCurrencyType(): CurrencyType | undefined {
    return this.facadeCurrenciesStore.getCurrencyType(this.toCurrency);
  }

  @computed
  get toAmountString(): string {
    return this.toAmount.toFixed(CurrencyTypeFractionLength[this.toCurrencyType]);
  }
  //#endregion

  @action
  async fetchFee() {
    const feeStr = await this.fees.getExchangeFee(this.fromCurrency, this.fromAmountRaw);
    this.feeAmount = new BigNumber(feeStr);
  }

  @computed
  get feeAmountString(): string {
    return this.feeAmount.toFixed(CurrencyTypeFractionLength[this.fromCurrencyType]);
  }

  @computed
  get feePercentString(): string {
    return '0.7';
  }

  get isValid(): boolean {
    return !this.fromError && !this.toError;
  }

  @computed
  get pair(): string {
    return `${this.fromCurrency}-${this.toCurrency}`;
  }

  @computed
  get isAsk() {
    return this.fromCurrencyType === CurrencyType.Fiat && this.toCurrencyType === CurrencyType.Crypto;
  }

  @computed
  get isBid() {
    return this.fromCurrencyType === CurrencyType.Crypto && this.toCurrencyType === CurrencyType.Fiat;
  }

  @computed
  get rate(): BigNumber {
    if (this.fromCurrencyType === CurrencyType.Fiat && this.toCurrencyType === CurrencyType.Crypto) {
      return this.bidRates[this.pair];
    }

    if (this.fromCurrencyType === CurrencyType.Crypto && this.toCurrencyType === CurrencyType.Fiat) {
      return this.askRates[this.pair];
    }

    return new BigNumber(NaN);
  }

  @computed
  get rate2(): BigNumber {// как то работает
    if (this.fromCurrencyType === CurrencyType.Fiat && this.toCurrencyType === CurrencyType.Crypto) {
      return this.askRates[this.pair];
    }

    if (this.fromCurrencyType === CurrencyType.Crypto && this.toCurrencyType === CurrencyType.Fiat) {
      return this.bidRates[this.pair];
    }

    return new BigNumber(NaN);
  }

  getPayload(type, twoFACode, withdrawalId) {
    const exchange = {
      isActive: true,
      from: { amount: this.fromAmountString, currency: this.fromCurrency },
      to: { currency: this.toCurrency },
    } as IInCreateTransactionExchangePartDTO;

    const withdrawal = {
      isActive: true,
      currency: this.toCurrency,
      type,
      methodId: withdrawalId,
    };

    if (withdrawalId !== -1) {
      return {
        type: TransactionType.ExchangeWithdrawal,
        exchange,
        withdrawal,
        code2FA: twoFACode,
      } as IInTransactionCreateDTO;
    } else {
      return {
        type: TransactionType.Exchange,
        exchange,
      } as IInTransactionCreateDTO;
    }
  }

  @computed
  get exchangePriceString(): string {
    if (this.fromCurrencyType === CurrencyType.Fiat && this.toCurrencyType === CurrencyType.Crypto) {
      return this.askRates[`${this.toCurrency}-${this.fromCurrency}`].toFixed(2);
    }

    if (this.fromCurrencyType === CurrencyType.Crypto && this.toCurrencyType === CurrencyType.Fiat) {
      return this.bidRates[this.pair].toFixed(2);
    }
  }

  @action
  swap() {
    this.isSwapped = !this.isSwapped;

    [this.fromAmountRaw, this.toAmountRaw] = [this.toAmountRaw, this.fromAmountRaw];
    [this.fromCurrency, this.toCurrency] = [this.toCurrency, this.fromCurrency];

    this.fromError = '';
    this.toError = '';

    this.lastChangedField = this.lastChangedField === ExchangeFields.From
      ? ExchangeFields.To
      : ExchangeFields.From;

    this.validateFrom();

    if (this.isFromValid) {
      this.calculate();
    }
  }

  @action
  calculate() {
    if (this.lastChangedField === ExchangeFields.From) {
      this.calculateTo();
    } else if (this.lastChangedField === ExchangeFields.To) {
      this.calculateFrom();
    }
  }

  // TODO: Возможно понадобится
  @action
  validateTo() {
    // const minAmount = this.exchangeMinAmountsStore.minAmounts.get(this.toCurrency) || new BigNumber(Infinity);
    // let maxAmount = new BigNumber(0);

    // console.log('validateTo');
    // console.log('toCurrencyType: ', this.toCurrencyType);
    // console.log('lastChangedField: ', this.lastChangedField);
    // console.log('isSwapped: ', this.isSwapped);
    //
    // if (!this.isSwapped) {
    //   if (this.toCurrencyType === CurrencyType.Fiat) {
    //     maxAmount = this.walletStore.fiatBalances.get(this.toCurrency);
    //   }
    //   if (this.toCurrencyType === CurrencyType.Crypto) {
    //     maxAmount = this.walletStore.cryptoBalances.get(this.toCurrency);
    //   }
    //
    //   const isMoreThanMaxAmount = (this.toAmount.isGreaterThan(maxAmount));
    //   const isPassesMinAmount = (this.toAmount.isGreaterThanOrEqualTo(minAmount));
    //
    //   if (!isPassesMinAmount) {
    //     this.toError = 'The min value should be ' + minAmount.toRGBAString();
    //   } else if (isMoreThanMaxAmount) {
    //     this.toError = 'Your balance is not enough';
    //   } else {
    //     this.toError = '';
    //   }
    // }
  }

  @action
  validateFrom() {
    this.minAmount = this.exchangeMinAmountsStore.minAmounts.get(this.fromCurrency) || new BigNumber(Infinity);
    let maxAmount = new BigNumber(0);

    if (this.fromCurrencyType === CurrencyType.Fiat) {
      maxAmount = this.walletStore.fiatBalances.get(this.fromCurrency);
    }
    if (this.fromCurrencyType === CurrencyType.Crypto) {
      maxAmount = this.walletStore.cryptoBalances.get(this.fromCurrency);
    }

    const isMoreThanMaxAmount = (this.fromAmount.isGreaterThan(maxAmount));
    const isPassesMinAmount = (this.fromAmount.isGreaterThanOrEqualTo(this.minAmount));

    if (!isPassesMinAmount) {
      this.fromError = 'dashboard.transactions.minValueShouldBe';
    } else if (isMoreThanMaxAmount) {
      this.fromError = 'dashboard.balanceIsInsufficient';
    } else {
      this.fromError = '';
    }
  }

  @computed
  get isFromValid() {
    return !this.fromError;
  }

  @action
  private calculateFrom() {
    if (this.toCurrencyType === CurrencyType.Crypto) {
      const fromAmountWithoutFee = this.toAmount.dividedBy(this.rate);
      const fee = fromAmountWithoutFee.multipliedBy(this.feeCoef);

      const fromAmount = fromAmountWithoutFee.plus(fee);
      this.fromAmountRaw = fromAmount.toFixed(CurrencyTypeFractionLength[this.fromCurrencyType]);

      this.validateFrom();
    } else if (this.toCurrencyType === CurrencyType.Fiat) {
      const fromAmountWithoutFee = this.toAmount.dividedBy(this.rate2);
      const fee = fromAmountWithoutFee.multipliedBy(this.feeCoef);

      const fromAmount = fromAmountWithoutFee.plus(fee);
      this.fromAmountRaw = fromAmount.toFixed(CurrencyTypeFractionLength[this.fromCurrencyType]);

      this.validateFrom();
    }
  }

  @action
  private calculateTo() {
    if (this.toCurrencyType === CurrencyType.Crypto) {
      const fee = this.fromAmount.multipliedBy(this.feeCoef);

      const receiveAmount = this.fromAmount.minus(fee).multipliedBy(this.rate);
      this.toAmountRaw = receiveAmount.toFixed(CurrencyTypeFractionLength[this.toCurrencyType]);

      // this.validateTo();
    } else if (this.toCurrencyType === CurrencyType.Fiat) {
      const fee = this.fromAmount.multipliedBy(this.feeCoef);

      const receiveAmount = this.fromAmount.minus(fee).multipliedBy(this.rate2);
      this.toAmountRaw = receiveAmount.toFixed(CurrencyTypeFractionLength[this.toCurrencyType]);
      // this.validateTo();`
    }
  }

  @action
  freeze(field: ExchangeFields) {
    if (field === ExchangeFields.From) {
      this.lastChangedField = ExchangeFields.To;
    } else if (field === ExchangeFields.To) {
      this.lastChangedField = ExchangeFields.From;
    }
  }

  @action
  forceSellCrypto(currency: string) {
    if (this.fromCurrencyType === CurrencyType.Fiat) {
      this.swap();
    }

    this.fromCurrency = currency;
  }

  @action
  onChange(field: ExchangeFields, amount: string, currency: string) {
    let satinizedAmount = amount;

    const isSpliceNeeded = amount.length > 1 && amount[1] !== '.' && amount[0] === '0';
    if (isSpliceNeeded) {
      satinizedAmount = amount.slice(1);
    }

    function isPositiveNumberString(value: string) {
      const number = Number(value);
      return (!isNaN(number));
    }

    const isValidAmount = isPositiveNumberString(satinizedAmount);

    if (field === ExchangeFields.From) {
      this.fromError = isValidAmount ? '' : 'dashboard.fieldMustBeANumber';
      if (!this.fromError) {
        const fraction = satinizedAmount.split('.')[1];
        if (fraction && fraction.length > CurrencyTypeFractionLength[this.fromCurrencyType]) {
          return;
        }
      }
    } else if (field === ExchangeFields.To) {
      this.toError = isValidAmount ? '' : 'dashboard.fieldMustBeANumber';
      if (!this.toError) {
        const fraction = satinizedAmount.split('.')[1];
        if (fraction && fraction.length > CurrencyTypeFractionLength[this.toCurrencyType]) {
          return;
        }
      }
    }

    if (!isValidAmount) {
      return;
    }

    if (field === ExchangeFields.From) {
      this.fromAmountRaw = satinizedAmount;
      this.fromCurrency = currency;
      this.validateFrom();
    } else if (field === ExchangeFields.To) {
      this.toAmountRaw = satinizedAmount;
      this.toCurrency = currency;
    }

    this.lastChangedField = field;
    this.calculate();
  }

  @action
  placeOrder(type, twoFACode, withdrawalId): Promise<string | undefined> {
    this.loaderStore.addTask(ExchangeStore.PLACE_ORDER_TASK);

    return new Promise(resolve => {
      this.axiosWrapper.post('/transactions', this.getPayload(type, twoFACode, withdrawalId))
        .then(this.onPlaceOrderSuccess).then((result: IOutTransactionDTO) => {
          // console.log('then = ', result);
          resolve(result.referenceId);
        })
        .catch(this.onPlaceOrderError).catch(() => resolve(undefined));
    });
  }

  @action.bound
  onPlaceOrderSuccess(result:  IOutTransactionDTO) {
    this.loaderStore.removeTask(ExchangeStore.PLACE_ORDER_TASK);
    return result;
  }

  @action.bound
  onPlaceOrderError(reason: AxiosResponse) {
    if (!reason || !reason.data || !reason.data.message) {
      this.fromError = 'Unknown error';
    } else {
      const firstConstraint = reason.data.message[0];
      this.fromError = firstConstraint.description;
    }

    this.loaderStore.removeTask(ExchangeStore.PLACE_ORDER_TASK);
    throw reason;
  }
}
