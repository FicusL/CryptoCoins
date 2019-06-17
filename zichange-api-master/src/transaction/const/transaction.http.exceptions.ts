import { BadRequestException, ForbiddenException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { IExceptionMessage } from '../../core/errors/error.payload';
import { TransactionExceptionsCodes } from './transaction.exceptions.codes';
import { BigNumber } from 'bignumber.js';
import { KycTierLevel } from '../../kyc/const/kyc.tier-level.enum';
import { transactionModuleName } from './transaction.module.name';

export namespace TransactionHTTPExceptions {
  export class UnknownError extends InternalServerErrorException {
    constructor() {
      super([
        {
          code: TransactionExceptionsCodes.UnknownError,
          description: 'Unknown error',
          module: transactionModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class TransactionNotFound extends NotFoundException {
    constructor() {
      super([
        {
          code: TransactionExceptionsCodes.TransactionNotFound,
          description: 'Transaction not found',
          module: transactionModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class BadValueSpecified extends BadRequestException {
    constructor() {
      super([
        {
          code: TransactionExceptionsCodes.BadValueSpecified,
          description: 'Bad value specified',
          module: transactionModuleName,
        },
      ] as IExceptionMessage);
    }
  }

  export class BankAccountNotFound extends NotFoundException {
    constructor() {
      super([
        {
          code: TransactionExceptionsCodes.BankAccountNotFound,
          description: 'Bank account not found',
          module: transactionModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class CryptoWalletNotFound extends NotFoundException {
    constructor() {
      super([
        {
          code: TransactionExceptionsCodes.CryptoWalletNotFound,
          description: 'Crypto wallet not found',
          module: transactionModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class PaymentLimitExceeded extends ForbiddenException {
    constructor(data: { tierLevel: KycTierLevel, limit: BigNumber, remaining: BigNumber }) {
      const { tierLevel, limit, remaining } = data;

      const decimalPlaces = 2;

      const limitFixed = limit.toFixed(decimalPlaces);
      const remainingFixed = remaining.toFixed(decimalPlaces);

      super([
        {
          code: TransactionExceptionsCodes.PaymentLimitExceeded,
          description: `Payment limit exceeded. Left amount: ${remainingFixed} EUR`,
          module: transactionModuleName,
          property: 'amount',
          data: {
            limit: limitFixed,
            remaining: remainingFixed,
            tierLevel: Number(tierLevel),
            tierLevelNext: Number(tierLevel) + 1,
          },
        },
      ] as IExceptionMessage);
    }
  }
  export class BadKYCStatus extends ForbiddenException {
    constructor() {
      super([
        {
          code: TransactionExceptionsCodes.BadKYCStatus,
          description: 'Bad KYC status',
          module: transactionModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class NotFoundCurrency extends NotFoundException {
    constructor(currency: string) {
      super([
        {
          code: TransactionExceptionsCodes.NotFoundCurrency,
          description: `Not found currency: ${currency}`,
          module: transactionModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class NotRealizedTransactionType extends InternalServerErrorException {
    // if latter will be added new transaction types
    constructor() {
      super([
        {
          code: TransactionExceptionsCodes.NotRealizedTransactionType,
          description: 'Not realized transaction type',
          module: transactionModuleName,
          property: 'type',
        },
      ] as IExceptionMessage);
    }
  }
  export class CurrenciesMustBeDifferent extends BadRequestException {
    constructor() {
      super([
        {
          code: TransactionExceptionsCodes.CurrenciesMustBeDifferent,
          description: 'Currencies must be different',
          module: transactionModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class CurrenciesMustBeEquals extends BadRequestException {
    constructor() {
      super([
        {
          code: TransactionExceptionsCodes.CurrenciesMustBeEquals,
          description: 'Currencies must be equals',
          module: transactionModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class TransactionTypeNotMatchEndPoint extends BadRequestException {
    constructor() {
      super([
        {
          code: TransactionExceptionsCodes.TransactionTypeNotMatchEndPoint,
          description: 'Transaction type not match end point',
          module: transactionModuleName,
          property: 'type',
        },
      ] as IExceptionMessage);
    }
  }
  export class PaymentAmountLessThanMinimum extends BadRequestException {
    constructor(currency: string, minAmount: BigNumber) {
      super([
        {
          code: TransactionExceptionsCodes.PaymentAmountLessThanMinimum,
          description: `Payment amount for ${currency} less than minimum: ${minAmount.toString()}`,
          module: transactionModuleName,
          property: 'paymentAmount',
        },
      ] as IExceptionMessage);
    }
  }
  export class NotFoundFeeInfo extends NotFoundException {
    constructor(currency: string) {
      super([
        {
          code: TransactionExceptionsCodes.NotFoundFeeInfo,
          description: `Not found fee info for currency: ${currency}`,
          module: transactionModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class NotFoundRate extends NotFoundException {
    constructor(currenciesSearch: string) {
      super([
        {
          code: TransactionExceptionsCodes.NotFoundRate,
          description: `Not found rate: ${currenciesSearch}`,
          module: transactionModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class BadDepositMethodType extends BadRequestException {
    constructor() {
      super([
        {
          code: TransactionExceptionsCodes.BadPaymentMethodType,
          description: `Bad deposit method type`,
          module: transactionModuleName,
          property: 'paymentMethodType',
        },
      ] as IExceptionMessage);
    }
  }
  export class BadWithdrawalMethodType extends BadRequestException {
    constructor() {
      super([
        {
          code: TransactionExceptionsCodes.BadReceiveMethodType,
          description: `Bad withdrawal method type`,
          module: transactionModuleName,
          property: 'receiveMethodType',
        },
      ] as IExceptionMessage);
    }
  }
  export class BadFromCurrency extends BadRequestException {
    constructor(currency: string) {
      super([
        {
          code: TransactionExceptionsCodes.BadFromCurrency,
          description: `Bad from currency: ${currency}`,
          module: transactionModuleName,
          property: 'from.currency',
        },
      ] as IExceptionMessage);
    }
  }
  export class BadToCurrency extends BadRequestException {
    constructor(currency: string) {
      super([
        {
          code: TransactionExceptionsCodes.BadToCurrency,
          description: `Bad to currency: ${currency}`,
          module: transactionModuleName,
          property: 'to.currency',
        },
      ] as IExceptionMessage);
    }
  }
  export class BadFromAmount extends BadRequestException {
    constructor() {
      super([
        {
          code: TransactionExceptionsCodes.BadFromAmount,
          description: `Bad from amount`,
          module: transactionModuleName,
          property: 'from.amount',
        },
      ] as IExceptionMessage);
    }
  }
  export class BadToAmount extends BadRequestException {
    constructor() {
      super([
        {
          code: TransactionExceptionsCodes.BadToAmount,
          description: `Bad to amount`,
          module: transactionModuleName,
          property: 'to.amount',
        },
      ] as IExceptionMessage);
    }
  }
  export class BadPair extends BadRequestException {
    constructor(pair: string) {
      super([
        {
          code: TransactionExceptionsCodes.BadPair,
          description: `Bad pair: ${pair}`,
          module: transactionModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class BadDepositCurrency extends BadRequestException {
    constructor(currency: string) {
      super([
        {
          code: TransactionExceptionsCodes.BadPaymentCurrency,
          description: `Bad payment currency: ${currency}`,
          module: transactionModuleName,
          property: 'paymentCurrency',
        },
      ] as IExceptionMessage);
    }
  }
  export class BadWithdrawalCurrency extends BadRequestException {
    constructor(currency: string) {
      super([
        {
          code: TransactionExceptionsCodes.BadReceiveCurrency,
          description: `Bad receive currency: ${currency}`,
          module: transactionModuleName,
          property: 'receiveCurrency',
        },
      ] as IExceptionMessage);
    }
  }
  export class BadAmount extends BadRequestException {
    constructor() {
      super([
        {
          code: TransactionExceptionsCodes.BadPaymentAmount,
          description: `Bad payment amount`,
          module: transactionModuleName,
          property: 'paymentAmount',
        },
      ] as IExceptionMessage);
    }
  }
  export class NotFoundMinPaymentAmount extends NotFoundException {
    constructor(currency: string) {
      super([
        {
          code: TransactionExceptionsCodes.NotFoundMinPaymentAmount,
          description: `Not found min payment amount for currency: ${currency}`,
          module: transactionModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class BadReceiveAmount extends BadRequestException {
    constructor() {
      super([
        {
          code: TransactionExceptionsCodes.BadReceiveAmount,
          description: `Bad receive amount`,
          module: transactionModuleName,
          property: 'receiveAmount',
        },
      ] as IExceptionMessage);
    }
  }
  export class CantBePaid extends ForbiddenException {
    constructor() {
      super([
        {
          code: TransactionExceptionsCodes.CantBePaid,
          description: 'Transaction can\'t be paid',
          module: transactionModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class KycMustBeApproved extends ForbiddenException {
    constructor() {
      super([
        {
          code: TransactionExceptionsCodes.KycMustBeApproved,
          description: 'Kyc must be approved',
          module: transactionModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class NotEnabled2FA extends ForbiddenException {
    constructor() {
      super([
        {
          code: TransactionExceptionsCodes.NotEnabled2FA,
          description: 'Not enabled 2FA',
          module: transactionModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class BalanceLessThanPaymentAmount extends ForbiddenException {
    constructor() {
      super([
        {
          code: TransactionExceptionsCodes.BalanceLessThanPaymentAmount,
          description: 'Your balance is not enough',
          module: transactionModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class WithdrawalCantBeChanged extends ForbiddenException {
    constructor() {
      super([
        {
          code: TransactionExceptionsCodes.WithdrawalCantBeChanged,
          description: 'Withdrawal can\'t be changed for this transaction',
          module: transactionModuleName,
        },
      ] as IExceptionMessage);
    }
  }

  export class CommissionCannotBeCalculated extends BadRequestException {
    constructor() {
      super([
        {
          code: TransactionExceptionsCodes.CommissionCannotBeCalculated,
          description: 'Commission cannot be calculated',
          module: transactionModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class RateReceiptError extends InternalServerErrorException {
    constructor() {
      super([
        {
          code: TransactionExceptionsCodes.RateReceiptError,
          description: 'Rate receipt error',
          module: transactionModuleName,
        },
      ] as IExceptionMessage);
    }
  }

  export class AmountLessThanMinimum extends BadRequestException {
    constructor(minAmount: BigNumber) {
      super([
        {
          code: TransactionExceptionsCodes.AmountLessThanMinimum,
          description: `Amount less than minimum: ${minAmount.toString()}`,
          module: transactionModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class AmountMoreThanMaximum extends BadRequestException {
    constructor(maxAmount: BigNumber) {
      super([
        {
          code: TransactionExceptionsCodes.AmountMoreThanMaximum,
          description: `Amount more than maximum: ${maxAmount.toString()}`,
          module: transactionModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class TransactionMustBePending extends BadRequestException {
    constructor() {
      super([
        {
          code: TransactionExceptionsCodes.TransactionMustBePending,
          description: `Transaction must be pending`,
          module: transactionModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class IncompatibleTransactionType extends BadRequestException {
    constructor() {
      super([
        {
          code: TransactionExceptionsCodes.IncompatibleTransactionType,
          description: `Incompatible transaction type`,
          module: transactionModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class AmountLessThanFee extends BadRequestException {
    constructor() {
      super([
        {
          code: TransactionExceptionsCodes.AmountLessThanFee,
          description: `Amount less than fee`,
          module: transactionModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class NotFoundHotWalletAddress extends NotFoundException {
    constructor(currency: string) {
      super([
        {
          code: TransactionExceptionsCodes.NotFoundHotWalletAddress,
          description: `Not found hot wallet address for currency: ${currency}`,
          module: transactionModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class NotFoundCurrencyType extends NotFoundException {
    constructor(currency: string) {
      super([
        {
          code: TransactionExceptionsCodes.NotFoundCurrencyType,
          description: `Not found currency type for currency: ${currency}`,
          module: transactionModuleName,
        },
      ] as IExceptionMessage);
    }
  }
  export class BadCryptoAddress extends BadRequestException {
    constructor(address: string, currency: string) {
      super([
        {
          code: TransactionExceptionsCodes.BadCryptoAddress,
          description: `Bad crypto address: ${address}. Currency: ${currency}`,
          module: transactionModuleName,
        },
      ] as IExceptionMessage);
    }
  }

  export class ExchangeRateCantBeUpdated extends InternalServerErrorException {
    constructor() {
      super([
        {
          code: TransactionExceptionsCodes.ExchangeRateCantBeUpdated,
          description: 'Exchange rate cant be updated',
          module: transactionModuleName,
        },
      ] as IExceptionMessage);
    }
  }
}