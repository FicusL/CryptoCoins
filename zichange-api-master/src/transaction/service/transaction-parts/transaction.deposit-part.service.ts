import { Injectable } from '@nestjs/common';
import { ITransactionCreateDepositEmbedded } from '../../abstract/operations/transaction-parts/transaction.create.deposit-embedded.interface';
import { TransactionDepositEmbedded } from '../../entity/embedded/transaction-parts/transaction.deposit.embedded';
import { TransactionDepositMethodType } from '../../const/transaction.deposit-method.enum';
import { ICryptoWalletZichangeRequisitesData, ITransactionZichangeRequisites } from '../../abstract/transaction.zichange-requisites.interface';
import { SettingsBankAccountService } from '../../../settings/modules/bank-account/service/settings.bank-account.service';
import { AccountEntity } from '../../../account/entitiy/account.entity';
import { TransactionFeePartService } from './transaction.fee-part.service';
import { TransactionPartType } from '../../../core/const/core.transaction-part-type.enum';
import { TransactionLimitsValidationService } from '../transaction.limits-validation.service';
import { SettingsFacadeCurrenciesService } from '../../../settings/modules/curencies/service/settings.facade.currencies.service';
import { CurrencyType } from '../../../core/const/core.currency-type.enum';
import { TransactionHTTPExceptions } from '../../const/transaction.http.exceptions';
import { TransactionAmountsService } from '../transaction.amounts.service';
import { RatesServiceProviderBase } from '../../../rates/service/rates.service.provider.base';

@Injectable()
export class TransactionDepositPartService {
  constructor(
    private readonly transactionFeePartService: TransactionFeePartService,
    private readonly transactionLimitsValidationService: TransactionLimitsValidationService,
    private readonly transactionAmountsService: TransactionAmountsService,

    private readonly settingsBankAccountService: SettingsBankAccountService,
    private readonly settingsFacadeCurrenciesService: SettingsFacadeCurrenciesService,
    private readonly exchangeService: RatesServiceProviderBase,
  ) { }

  async createDepositTransactionPart(
    account: AccountEntity,
    params: ITransactionCreateDepositEmbedded,
    options: {
      isB2BTransaction: boolean,
    },
  ): Promise<TransactionDepositEmbedded> {
    const { currency, method, amount, paid } = params;

    const currencyType = await this.settingsFacadeCurrenciesService.getCurrencyType(currency);
    if (!currencyType) {
      throw new TransactionHTTPExceptions.BadDepositCurrency(currency);
    }

    const isInvalidMethod =
      params.method.type === TransactionDepositMethodType.CryptoWallet && currencyType !== CurrencyType.Crypto ||
      params.method.type !== TransactionDepositMethodType.CryptoWallet && currencyType === CurrencyType.Crypto;

    if (isInvalidMethod) {
      throw new TransactionHTTPExceptions.BadDepositMethodType();
    }

    const externalEUREquivalent = this.exchangeService.getEUREquivalent(currency, amount);

    const [ zichangeRequisites, fee ] = await Promise.all([
      this.createDepositTransactionZichangeRequisites(account, params),
      this.transactionFeePartService.getFeeEmbedded(TransactionPartType.Deposit, currency, amount, {
        depositMethod: params.method.type,
        isB2BTransaction: options.isB2BTransaction,
      }),

      this.transactionLimitsValidationService.validateDepositAccountLimits(account, externalEUREquivalent, currency, options.isB2BTransaction),
    ]);

    this.transactionAmountsService.validateAmount(amount, TransactionPartType.Deposit, currency, {
      depositMethod: params.method.type,
    });

    // See the README
    if (amount.isLessThan(fee.value)) {
      throw new TransactionHTTPExceptions.AmountLessThanFee();
    }

    return new TransactionDepositEmbedded({
      isActive: true,
      currency,
      amount,
      method,
      fee,
      externalEUREquivalent,
      zichangeRequisites,
      paid,
      btcBlockchainIndex: params.btcBlockchainIndex,
      ethTxHash: params.ethTxHash,
      zcnTxHash: params.zcnTxHash,
    });
  }

  protected async createDepositTransactionZichangeRequisites(account: AccountEntity, params: ITransactionCreateDepositEmbedded)
    : Promise<ITransactionZichangeRequisites>
  {
    const type = params.method.type;
    const currency = params.currency;

    if (type === TransactionDepositMethodType.BankAccount) {
      const data = await this.settingsBankAccountService.get();

      return { type, data };
    } else if (type === TransactionDepositMethodType.CryptoWallet) {
      const hotWalletAddresses = account.hotWalletAddresses;

      const address: string | undefined = hotWalletAddresses[currency];
      if (!address) {
        throw new TransactionHTTPExceptions.NotFoundHotWalletAddress(currency);
      }

      const data = { currency, address } as ICryptoWalletZichangeRequisitesData;
      return { type, data };
    } else if (type === TransactionDepositMethodType.BilderlingsBankCard) {
      return { type, data: {} };
    } else if (type === TransactionDepositMethodType.RoyalPayBankCard) {
      return { type, data: {} };
    } else if (type === TransactionDepositMethodType.RbkMoney) {
      return { type, data: {} };
    }

    return { type, data: {} };
  }
}