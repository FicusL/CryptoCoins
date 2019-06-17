import {TransactionPartType} from '../../core/const/core.transaction-part-type.enum';
import {BigNumber} from 'bignumber.js';
import {TransactionDepositMethodType} from '../const/transaction.deposit-method.enum';
import {TransactionWithdrawalMethodType} from '../const/transaction.withdrawal-method.enum';
import {Injectable} from '@nestjs/common';
import {TransactionHTTPExceptions} from '../const/transaction.http.exceptions';
import { ConfigsService } from '../../core/service/configs.service';

interface IOptions {
  depositMethod?: TransactionDepositMethodType;
  withdrawalMethod?: TransactionWithdrawalMethodType;
}

@Injectable()
export class TransactionAmountsService {
  getMinAmount(type: TransactionPartType, currency: string, options?: IOptions): BigNumber {
    if (ConfigsService.noAmountLimitsAndFees) {
      return new BigNumber('0');
    }

    options = options || {};
    const { depositMethod, withdrawalMethod } = options;

    if (type === TransactionPartType.Deposit) {

      if (currency === 'BTC') {
        return new BigNumber('0.0001');
      } else if (currency === 'ZCN') {
        return new BigNumber('0');
      } else if (currency === 'ETH') {
        return new BigNumber('0');
      } else if (currency === 'EUR') {
        if (depositMethod === TransactionDepositMethodType.BankAccount) { // SEPA
          return new BigNumber('1');
        } else if (depositMethod === TransactionDepositMethodType.Payeer) {
          return new BigNumber('20');
        } else if (depositMethod === TransactionDepositMethodType.AdvancedCash) {
          return new BigNumber('100');
        } else if (depositMethod === TransactionDepositMethodType.BilderlingsBankCard) {
          return new BigNumber('0');
        } else if (depositMethod === TransactionDepositMethodType.RoyalPayBankCard) {
          return new BigNumber('0');
        }
      } else if (currency === 'USD') {
        if (depositMethod === TransactionDepositMethodType.Payeer) {
          return new BigNumber('20');
        } else if (depositMethod === TransactionDepositMethodType.AdvancedCash) {
          return new BigNumber('100');
        } else if (depositMethod === TransactionDepositMethodType.BilderlingsBankCard) {
          return new BigNumber('0');
        } else if (depositMethod === TransactionDepositMethodType.RoyalPayBankCard) {
          return new BigNumber('0');
        }
      }

    } else if (type === TransactionPartType.Exchange) {

      if (currency === 'BTC') {
        return new BigNumber('0.0001');
      } else if (currency === 'ZCN') {
        return new BigNumber('0');
      } else if (currency === 'ETH') {
        return new BigNumber('0');
      } else if (currency === 'EUR') {
        return new BigNumber('25');
      } else if (currency === 'USD') {
        return new BigNumber('25');
      }

    } else if (type === TransactionPartType.Withdrawal) {
      if (currency === 'BTC') {
        return new BigNumber('0.0001');
      } else if (currency === 'ZCN') {
        return new BigNumber('0');
      } else if (currency === 'ETH') {
        return new BigNumber('0');
      } else if (currency === 'EUR') {
        if (withdrawalMethod === TransactionWithdrawalMethodType.BankAccount) { // SEPA
          return new BigNumber('1');
        } else if (withdrawalMethod === TransactionWithdrawalMethodType.Payeer) {
          return new BigNumber('100');
        } else if (withdrawalMethod === TransactionWithdrawalMethodType.AdvancedCash) {
          return new BigNumber('100');
        }
      } else if (currency === 'USD') {
        if (withdrawalMethod === TransactionWithdrawalMethodType.Payeer) {
          return new BigNumber('100');
        } else if (withdrawalMethod === TransactionWithdrawalMethodType.AdvancedCash) {
          return new BigNumber('100');
        }
      }
    }

    return new BigNumber('0');
  }

  getMaxAmount(type: TransactionPartType, currency: string, options?: IOptions): BigNumber {
    if (ConfigsService.noAmountLimitsAndFees) {
      return new BigNumber(Infinity);
    }

    options = options || {};
    const { depositMethod, withdrawalMethod } = options;

    if (type === TransactionPartType.Deposit) {

      if (currency === 'EUR') {
        if (depositMethod === TransactionDepositMethodType.Payeer) {
          return new BigNumber('5000');
        } else if (depositMethod === TransactionDepositMethodType.AdvancedCash) {
          return new BigNumber('10000');
        }
      } else if (currency === 'USD') {
        if (depositMethod === TransactionDepositMethodType.Payeer) {
          return new BigNumber('5000');
        } else if (depositMethod === TransactionDepositMethodType.AdvancedCash) {
          return new BigNumber('10000');
        }
      }

    } else if (type === TransactionPartType.Withdrawal) {

      if (currency === 'EUR') {
        if (withdrawalMethod === TransactionWithdrawalMethodType.Payeer) {
          return new BigNumber('10000');
        } else if (withdrawalMethod === TransactionWithdrawalMethodType.AdvancedCash) {
          return new BigNumber('10000');
        }
      } else if (currency === 'USD') {
        if (withdrawalMethod === TransactionWithdrawalMethodType.Payeer) {
          return new BigNumber('10000');
        } else if (withdrawalMethod === TransactionWithdrawalMethodType.AdvancedCash) {
          return new BigNumber('10000');
        }
      }
    }

    return new BigNumber(Infinity);
  }

  validateAmount(amount: BigNumber, type: TransactionPartType, currency: string, options?: IOptions) {
    const minAmount = this.getMinAmount(type, currency, options);
    const maxAmount = this.getMaxAmount(type, currency, options);

    if (amount.isLessThan(minAmount)) {
      throw new TransactionHTTPExceptions.AmountLessThanMinimum(minAmount);
    }

    if (amount.isGreaterThan(maxAmount)) {
      throw new TransactionHTTPExceptions.AmountMoreThanMaximum(maxAmount);
    }
  }
}