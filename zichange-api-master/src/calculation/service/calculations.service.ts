import { BigNumber } from 'bignumber.js';
import { ICalcTransactionItem } from '../types/calculation.transaction-item.interface';
import { DepositQuantityIsLessThanWithdrawalException } from '../exceptions/deposit-quantity-is-less-than-withdrawal.exception';
import { TransactionEntity } from '../../transaction/entity/transaction.entity';
import { TransactionType } from '../../transaction/const/transaction.type.enum';

export class CalculationsService {
  // region Public methods

  public averagePurchasePrice(deposit: ICalcTransactionItem[], withdrawal: ICalcTransactionItem[]): BigNumber {
    const comparator = (left: ICalcTransactionItem, right: ICalcTransactionItem) => left.date.getTime() - right.date.getTime(); // Sort ascending
    deposit.sort(comparator);

    const reducer = (previous: BigNumber, current: ICalcTransactionItem) => previous.plus(current.quantity);
    const totalDepositQuantity = deposit.reduce(reducer, new BigNumber(0));
    const totalWithdrawalQuantity = withdrawal.reduce(reducer, new BigNumber(0));

    if (totalDepositQuantity.isLessThan(totalWithdrawalQuantity)) {
      throw new DepositQuantityIsLessThanWithdrawalException();
    }

    let currentQuantity = new BigNumber('0');
    let mustPush = false;
    const resultArray: ICalcTransactionItem[] = [];

    for (const depositItem of deposit) {
      if (mustPush) {
        resultArray.push(depositItem);
        continue;
      }

      currentQuantity = currentQuantity.plus(depositItem.quantity);

      if (currentQuantity.isGreaterThan(totalWithdrawalQuantity)) {
        const delta = currentQuantity.minus(totalWithdrawalQuantity);
        resultArray.push({
          quantity: delta,
          price: depositItem.price,
          date: depositItem.date,
        });

        mustPush = true;
      } else if (currentQuantity.isEqualTo(totalWithdrawalQuantity)) {
        mustPush = true;
      }
    }

    let topPartOfAveragePrice = new BigNumber('0');
    let totalQuantity = new BigNumber('0');

    for (const item of resultArray) {
      topPartOfAveragePrice = topPartOfAveragePrice.plus(item.quantity.multipliedBy(item.price));
      totalQuantity = totalQuantity.plus(item.quantity);
    }

    if (totalQuantity.isEqualTo('0')) {
      return new BigNumber('0');
    }

    return topPartOfAveragePrice.dividedBy(totalQuantity);
  }

  public unrealizedProfitLoss(currentBalance: BigNumber, currentPrice: BigNumber, averagePrice: BigNumber): BigNumber {
    return currentBalance.multipliedBy(currentPrice.minus(averagePrice));
  }

  public getArraysForAveragePurchasePrice(
    transactions: TransactionEntity[],
    currency: string,
    rateForPrice: BigNumber,
  ): IAveragePurchasePriceData {
    const deposit: ICalcTransactionItem[] = [];
    const withdrawal: ICalcTransactionItem[] = [];

    for (const transaction of transactions) {
      const date = transaction.creation.date;

      const isExchange =
        transaction.type === TransactionType.Exchange ||
        transaction.type === TransactionType.BuyBasket ||
        transaction.type === TransactionType.SellBasket;

      if (transaction.type === TransactionType.Deposit) {
        if (transaction.deposit.currency === currency) {
          const getAmount = transaction.deposit.amount.minus(transaction.deposit.fee.amount);

          deposit.push({
            date,
            price: transaction.deposit.externalEUREquivalent.dividedBy(getAmount),
            quantity: getAmount,
          });
        }
      } else if (transaction.type === TransactionType.Withdrawal) {
        if (transaction.withdrawal.currency === currency) {
          withdrawal.push({
            date,
            price: transaction.withdrawal.externalEUREquivalent.dividedBy(transaction.withdrawal.amount),
            quantity: transaction.withdrawal.amount,
          });
        }
      } else if (isExchange) {
        if (transaction.exchange.from.currency === currency) {
          withdrawal.push({
            date,
            price: transaction.exchange.fromAmountEUREquivalent.dividedBy(transaction.exchange.from.amount),
            quantity: transaction.exchange.from.amount,
          });
        }

        if (transaction.exchange.to.currency === currency) {
          deposit.push({
            date,
            price: transaction.exchange.toAmountEUREquivalent.dividedBy(transaction.exchange.to.amount),
            quantity: transaction.exchange.to.amount,
          });
        }
      } else if (transaction.type === TransactionType.DepositExchange) {
        if (transaction.exchange.to.currency === currency) {
          deposit.push({
            date,
            price: transaction.exchange.toAmountEUREquivalent.dividedBy(transaction.exchange.to.amount),
            quantity: transaction.exchange.to.amount,
          });
        }
      } else if (transaction.type === TransactionType.ExchangeWithdrawal) {
        if (transaction.exchange.from.currency === currency) {
          withdrawal.push({
            date,
            price: transaction.exchange.fromAmountEUREquivalent.dividedBy(transaction.exchange.from.amount),
            quantity: transaction.exchange.from.amount,
          });
        }
      } else if (transaction.type === TransactionType.DepositExchangeWithdrawal) {
        // nothing
      } else if (transaction.type === TransactionType.Referral) {
        if (transaction.deposit.currency === currency) {
          deposit.push({
            date,
            price: transaction.deposit.externalEUREquivalent.dividedBy(transaction.deposit.amount),
            quantity: transaction.deposit.amount,
          });
        }
      } else if (transaction.type === TransactionType.ManagementFee) {
        if (transaction.fee.currency === currency) {
          withdrawal.push({
            date,
            price: transaction.fee.externalEUREquivalent.dividedBy(transaction.fee.amount),
            quantity: transaction.fee.amount,
          });
        }
      }
    }

    for (const item of deposit) {
      item.price = item.price.multipliedBy(rateForPrice);
    }

    for (const item of withdrawal) {
      item.price = item.price.multipliedBy(rateForPrice);
    }

    return { deposit, withdrawal };
  }

  // endregion
}

interface IAveragePurchasePriceData {
  deposit: ICalcTransactionItem[];
  withdrawal: ICalcTransactionItem[];
}