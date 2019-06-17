import { Injectable, NotImplementedException } from '@nestjs/common';
import { AccountEntity } from '../../../account/entitiy/account.entity';
import { TransactionFeePartService } from './transaction.fee-part.service';
import { TransactionPartType } from '../../../core/const/core.transaction-part-type.enum';
import { TransactionLimitsValidationService } from '../transaction.limits-validation.service';
import { ITransactionCreateWithdrawalEmbedded } from '../../abstract/operations/transaction-parts/transaction.create.withdrawal-embedded.interface';
import { TransactionWithdrawalEmbedded } from '../../entity/embedded/transaction-parts/transaction.withdrawal.embedded';
import { SettingsFacadeCurrenciesService } from '../../../settings/modules/curencies/service/settings.facade.currencies.service';
import { TransactionHTTPExceptions } from '../../const/transaction.http.exceptions';
import { CurrencyType } from '../../../core/const/core.currency-type.enum';
import { TransactionWithdrawalMethodType } from '../../const/transaction.withdrawal-method.enum';
import { BigNumber } from 'bignumber.js';
import { BankAccountService } from '../../../requisite/service/bank.account.service';
import { CryptoWalletService } from '../../../requisite/service/crypto.wallet.service';
import { CryptoWalletEntity } from '../../../requisite/entity/crypto.wallet.entity';
import { BankAccountEntity } from '../../../requisite/entity/bank.account.entity';
import { Account2FAService } from '../../../account/service/account.2fa.service';
import { ITransactionWithdrawalMethodEmbedded } from '../../abstract/operations/transaction-parts/transaction.withdrawal.method.embedded.interface';
import { TransactionAmountsService } from '../transaction.amounts.service';
import { RatesServiceProviderBase } from '../../../rates/service/rates.service.provider.base';
import { BalanceRepository } from '../../../balance/service/balance.repository';

@Injectable()
export class TransactionWithdrawalPartService {
  constructor(
    private readonly balanceRepository: BalanceRepository,

    private readonly transactionFeePartService: TransactionFeePartService,
    private readonly transactionLimitsValidationService: TransactionLimitsValidationService,
    private readonly transactionAmountsService: TransactionAmountsService,

    private readonly account2FAService: Account2FAService,
    private readonly exchangeService: RatesServiceProviderBase,
    private readonly bankAccountService: BankAccountService,
    private readonly cryptoWalletService: CryptoWalletService,
    private readonly settingsFacadeCurrenciesService: SettingsFacadeCurrenciesService,
  ) { }

  // region Public methods

  async createWithdrawalTransactionPart(
    account: AccountEntity,
    params: ITransactionCreateWithdrawalEmbedded,
    options: {
      balanceCorrection?: BigNumber,
      verify2FA: boolean,
      isB2BTransaction: boolean,
    },
  ): Promise<TransactionWithdrawalEmbedded> {
    const { currency, method: methodRaw, amount, code } = params;

    if (options.verify2FA) {
      await this.account2FAService.verify2FA(account, code);
    }

    const currencyType = await this.settingsFacadeCurrenciesService.getCurrencyType(currency);
    if (!currencyType) {
      throw new TransactionHTTPExceptions.BadWithdrawalCurrency(currency);
    }

    const isInvalidMethod =
      ((methodRaw.type === TransactionWithdrawalMethodType.CryptoWallet ||
        methodRaw.type === TransactionWithdrawalMethodType.CounterpartyCryptoWallet) && currencyType !== CurrencyType.Crypto) ||
      (methodRaw.type !== TransactionWithdrawalMethodType.CryptoWallet &&
       methodRaw.type !== TransactionWithdrawalMethodType.CounterpartyCryptoWallet) && currencyType === CurrencyType.Crypto;

    if (isInvalidMethod) {
      throw new TransactionHTTPExceptions.BadWithdrawalMethodType();
    }

    const externalEUREquivalent = this.exchangeService.getEUREquivalent(currency, amount);

    const [ balances, fee, method ] = await Promise.all([
      this.balanceRepository.getCurrenciesBalances(account.id),
      this.transactionFeePartService.getFeeEmbedded(TransactionPartType.Withdrawal, currency, amount, {
        withdrawalMethod: params.method.type,
        isB2BTransaction: options.isB2BTransaction,
      }),
      this.getWithdrawalMethod(account, methodRaw.type, methodRaw.id),

      this.transactionLimitsValidationService.validateWithdrawalAccountLimits(account, externalEUREquivalent, currency, options.isB2BTransaction),
    ]);

    this.transactionAmountsService.validateAmount(amount, TransactionPartType.Withdrawal, currency, {
      withdrawalMethod: methodRaw.type,
    });

    let balanceCorrection = new BigNumber(0);
    if (options.balanceCorrection && !options.balanceCorrection.isNaN()) {
      balanceCorrection = options.balanceCorrection;
    }

    const balance = (balances.get(currency) || new BigNumber(0)).plus(balanceCorrection);
    const isNotEnoughBalance = balance.isLessThan(amount);
    if (isNotEnoughBalance) {
      throw new TransactionHTTPExceptions.BalanceLessThanPaymentAmount();
    }

    if (!method) {
      throw new NotImplementedException();
    }

    // See the README
    if (amount.isLessThan(fee.value)) {
      throw new TransactionHTTPExceptions.AmountLessThanFee();
    }

    return new TransactionWithdrawalEmbedded({
      isActive: true,
      currency,
      amount,
      method,
      fee,
      externalEUREquivalent,
    });
  }

  // endregion

  // region Private methods

  private async getWithdrawalMethod(
    account: AccountEntity,
    methodType: TransactionWithdrawalMethodType,
    methodId: number,
  ): Promise<ITransactionWithdrawalMethodEmbedded | undefined> {
    if (methodType === TransactionWithdrawalMethodType.CounterpartyCryptoWallet) {
      return {
        type: TransactionWithdrawalMethodType.CounterpartyCryptoWallet,
        bankAccount: undefined,
        cryptoWallet: undefined,
      };
    }

    const entity = await this.getWithdrawalMethodEntity(account, methodType, methodId);
    if (!entity) {
      return undefined;
    }

    if (entity instanceof BankAccountEntity) {
      return {
        type: TransactionWithdrawalMethodType.BankAccount,
        bankAccount: entity,
        cryptoWallet: undefined,
      };
    }

    if (entity instanceof CryptoWalletEntity) {
      return {
        type: TransactionWithdrawalMethodType.CryptoWallet,
        bankAccount: undefined,
        cryptoWallet: entity,
      };
    }

    return undefined;
  }

  private async getWithdrawalMethodEntity(
    account: AccountEntity,
    methodType: TransactionWithdrawalMethodType,
    methodId: number,
  ): Promise<BankAccountEntity | CryptoWalletEntity | undefined> {
    if (methodType === TransactionWithdrawalMethodType.BankAccount) {
      const bankAccount = await this.bankAccountService.getById(methodId);
      if (bankAccount.account.id !== account.id) {
        throw new TransactionHTTPExceptions.BankAccountNotFound();
      }

      return bankAccount;
    }

    if (methodType === TransactionWithdrawalMethodType.CryptoWallet) {
      const cryptoWallet = await this.cryptoWalletService.getById(methodId);
      if (cryptoWallet.account.id !== account.id) {
        throw new TransactionHTTPExceptions.CryptoWalletNotFound();
      }

      return cryptoWallet;
    }

    return undefined;
  }

  // endregion
}