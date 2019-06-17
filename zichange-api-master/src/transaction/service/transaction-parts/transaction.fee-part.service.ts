import { Injectable } from '@nestjs/common';
import { BigNumber } from 'bignumber.js';
import { FeeType } from '../../../core/const/core.fee.type.enum';
import { TransactionOperationFeeEmbedded } from '../../entity/embedded/transaction-parts/transaction-operation.fee.embedded';
import { TransactionPartType } from '../../../core/const/core.transaction-part-type.enum';
import { TransactionDepositMethodType } from '../../const/transaction.deposit-method.enum';
import { TransactionWithdrawalMethodType } from '../../const/transaction.withdrawal-method.enum';
import { TransactionHTTPExceptions } from '../../const/transaction.http.exceptions';
import { RatesServiceProviderBase } from '../../../rates/service/rates.service.provider.base';
import { ConfigsService } from '../../../core/service/configs.service';

interface IFee {
  type: FeeType;
  amount: BigNumber;
}

interface IOptions {
  depositMethod?: TransactionDepositMethodType;
  withdrawalMethod?: TransactionWithdrawalMethodType;
  isB2BTransaction: boolean;
}

@Injectable()
export class TransactionFeePartService {
  constructor(
    protected readonly ratesService: RatesServiceProviderBase,
  ) { }

  // region Public methods

  async getFeeEmbedded(
    partType: TransactionPartType,
    key: string,
    amount: BigNumber,
    options: IOptions,
  ): Promise<TransactionOperationFeeEmbedded> {
    let currency = key;
    if (partType === TransactionPartType.Exchange) {
      currency = key.split('-')[0];
    }

    const fee = await this.getFee(partType, currency, amount, options);

    return new TransactionOperationFeeEmbedded({
      key,
      currency,
      type: fee.type,
      value: new BigNumber('0'), // fill this field later?
      amount: fee.amount,
    });
  }

  async getFee(
    partType: TransactionPartType,
    currency: string,
    amount: BigNumber,
    options: IOptions,
  ): Promise<IFee> {
    if (options.isB2BTransaction) {
      return {
        type: FeeType.Amount,
        amount: new BigNumber(0),
      };
    }

    if (ConfigsService.noAmountLimitsAndFees) {
      return {
        type: FeeType.Amount,
        amount: new BigNumber(0),
      };
    }

    if (partType === TransactionPartType.BuyBasket) {
      return {
        type: FeeType.Coefficient,
        amount: amount.multipliedBy('0.01'),
      };
    }

    if (partType === TransactionPartType.SellBasket) {
      return {
        type: FeeType.Amount,
        amount: new BigNumber(0),
      };
    }

    if (partType === TransactionPartType.Deposit) {
      return await this.getDepositFee(currency, amount, options.depositMethod);
    } else if (partType === TransactionPartType.Exchange) {
      return await this.getExchangeFee(currency, amount);
    } else if (partType === TransactionPartType.Withdrawal) {
      return await this.getWithdrawalFee(currency, amount, options.withdrawalMethod);
    }

    throw new TransactionHTTPExceptions.CommissionCannotBeCalculated();
  }

  // endregion

  // region Private methods

  private async getDepositFee(
    currency: string,
    amount: BigNumber,
    depositMethod?: TransactionDepositMethodType,
  ): Promise<IFee> {
    if (currency === 'BTC') {

      return {
        type: FeeType.Amount,
        amount: new BigNumber(0),
      };

    } else if (currency === 'ZCN') {

      return {
        type: FeeType.Amount,
        amount: new BigNumber(0),
      };

    } else if (currency === 'ETH') {

      return {
        type: FeeType.Amount,
        amount: new BigNumber(0),
      };

    } else if (currency === 'EUR') {

      if (depositMethod === TransactionDepositMethodType.BankAccount) { // SEPA
        return {
          type: FeeType.Amount,
          amount: new BigNumber(0),
        };
      } else if (depositMethod === TransactionDepositMethodType.Payeer) {
        return {
          type: FeeType.CoefficientPlusAmount,
          amount: amount.multipliedBy('0.03').plus('9.95'),
        };
      } else if (depositMethod === TransactionDepositMethodType.AdvancedCash) {
        return {
          type: FeeType.CoefficientPlusAmount,
          amount: amount.multipliedBy('0.0295').plus('10'),
        };
      } else if (depositMethod === TransactionDepositMethodType.BilderlingsBankCard) {
        return {
          type: FeeType.Amount,
          amount: new BigNumber('0'),
        };
      } else if (depositMethod === TransactionDepositMethodType.RoyalPayBankCard) {
        return {
          type: FeeType.Coefficient,
          amount: amount.multipliedBy('0.04'),
        };
      }

    } else if (currency === 'USD') {

      const rate = await this.ratesService.getRate('EUR', 'USD');
      if (!rate) {
        throw new TransactionHTTPExceptions.RateReceiptError();
      }

      if (depositMethod === TransactionDepositMethodType.Payeer) {
        const additionalFee = (new BigNumber('9.95')).multipliedBy(rate);

        return {
          type: FeeType.CoefficientPlusAmount,
          amount: amount.multipliedBy('0.03').plus(additionalFee),
        };
      } else if (depositMethod === TransactionDepositMethodType.AdvancedCash) {
        const additionalFee = (new BigNumber('10')).multipliedBy(rate);

        return {
          type: FeeType.CoefficientPlusAmount,
          amount: amount.multipliedBy('0.0295').plus(additionalFee),
        };
      } else if (depositMethod === TransactionDepositMethodType.BilderlingsBankCard) {
        return {
          type: FeeType.Amount,
          amount: new BigNumber('0'),
        };
      } else if (depositMethod === TransactionDepositMethodType.RoyalPayBankCard) {
        return {
          type: FeeType.Coefficient,
          amount: amount.multipliedBy('0.04'),
        };
      }

    }

    throw new TransactionHTTPExceptions.CommissionCannotBeCalculated();
  }

  private async getExchangeFee(currency: string, amount: BigNumber): Promise<IFee> {
    let feeValue = amount.multipliedBy('0.002');
    let minFee = new BigNumber('0');

    if (currency === 'BTC') {
      minFee = new BigNumber('0.001');
    } else if (currency === 'ZCN') {
      minFee = new BigNumber('0');
    } else if (currency === 'ETH') {
      minFee = new BigNumber('0.03');
    } else if (currency === 'EUR') {
      minFee = new BigNumber('5');
    } else if (currency === 'USD') {
      minFee = new BigNumber('25');
    } else {
      throw new TransactionHTTPExceptions.CommissionCannotBeCalculated();
    }

    if (feeValue.isLessThan(minFee)) {
      feeValue = minFee;
    }

    return {
      type: FeeType.CoefficientWithMinAmount,
      amount: feeValue,
    };
  }

  private async getWithdrawalFee(
    currency: string,
    amount: BigNumber,
    withdrawalMethod?: TransactionWithdrawalMethodType,
  ): Promise<IFee> {
    if (currency === 'BTC') {

      return {
        type: FeeType.Amount,
        amount: new BigNumber(0),
      };

    } else if (currency === 'ZCN') {

      return {
        type: FeeType.Amount,
        amount: new BigNumber(0),
      };

    } else if (currency === 'ETH') {

      return {
        type: FeeType.Amount,
        amount: new BigNumber(0),
      };

    } else if (currency === 'EUR') {

      if (withdrawalMethod === TransactionWithdrawalMethodType.BankAccount) { // SEPA
        const minFee = new BigNumber('5');

        let feeValue = amount.multipliedBy('0.005');
        if (feeValue.isLessThan(minFee)) {
          feeValue = minFee;
        }

        return {
          type: FeeType.CoefficientWithMinAmount,
          amount: feeValue,
        };
      } else if (withdrawalMethod === TransactionWithdrawalMethodType.Payeer) {
        return {
          type: FeeType.Amount,
          amount: new BigNumber('1'),
        };
      } else if (withdrawalMethod === TransactionWithdrawalMethodType.AdvancedCash) {
        return {
          type: FeeType.Amount,
          amount: new BigNumber('1'),
        };
      }

    } else if (currency === 'USD') {

      const rate = await this.ratesService.getRate('EUR', 'USD');
      if (!rate) {
        throw new TransactionHTTPExceptions.RateReceiptError();
      }

      if (withdrawalMethod === TransactionWithdrawalMethodType.Payeer) {
        return {
          type: FeeType.Amount,
          amount: (new BigNumber('1')).multipliedBy(rate),
        };
      } else if (withdrawalMethod === TransactionWithdrawalMethodType.AdvancedCash) {
        return {
          type: FeeType.Amount,
          amount: (new BigNumber('1')).multipliedBy(rate),
        };
      }

    }

    throw new TransactionHTTPExceptions.CommissionCannotBeCalculated();
  }

  // endregion
}