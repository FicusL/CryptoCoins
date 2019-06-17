import { CalculationsService } from './calculations.service';
import { BigNumber } from 'bignumber.js';
import { createIdGenerator } from '../../../test/common/create-id-generator';
import { ICalcTransactionItem } from '../types/calculation.transaction-item.interface';

describe('CalculationsService', () => {
  const calculations = new CalculationsService();

  describe('Average Purchase Price', () => {
    it('Without withdrawal', () => {
      const deposits: ICalcTransactionItem[] = [
        createItem('2', '4000'),
        createItem('1', '4300'),
      ];

      const withdrawals: ICalcTransactionItem[] = [];

      const result = calculations.averagePurchasePrice(deposits, withdrawals);
      expect(result.isEqualTo('4100')).toBe(true);
    });

    it('With withdrawal', () => {
      const deposits: ICalcTransactionItem[] = [
        createItem('1', '5000'),
        createItem('2', '5300'),
        createItem('0.5', '5200'),
      ];

      const withdrawals: ICalcTransactionItem[] = [
        createItem('1.5', '5500'),
      ];

      const result = calculations.averagePurchasePrice(deposits, withdrawals);
      expect(result.isEqualTo('5275')).toBe(true);
    });

    it('Withdrawal is great than deposit', () => {
      const deposits: ICalcTransactionItem[] = [
        createItem('1', '5000'),
      ];

      const withdrawals: ICalcTransactionItem[] = [
        createItem('1.5', '5500'),
      ];

      expect(() => calculations.averagePurchasePrice(deposits, withdrawals)).toThrow();
    });

    it('Zero', () => {
      const deposits: ICalcTransactionItem[] = [
        createItem('1', '5000'),
        createItem('2', '5000'),
        createItem('3', '5000'),
      ];

      const withdrawals: ICalcTransactionItem[] = [
        createItem('2.5', '5500'),
        createItem('1.5', '5500'),
        createItem('2', '5500'),
      ];

      const result = calculations.averagePurchasePrice(deposits, withdrawals);
      expect(result.isEqualTo('0')).toBe(true);
    });
  });

  describe('Unrealized Profit/Loss', () => {
    it('test', () => {
      const currentBalance = new BigNumber('1');
      const currentPrice = new BigNumber('4500');
      const averagePrice = new BigNumber('4000');

      const result = calculations.unrealizedProfitLoss(currentBalance, currentPrice, averagePrice);
      expect(result.isEqualTo('500')).toBe(true);
    });
  });
});

const nextDate = createIdGenerator(0);

function createItem(quantity: string, price: string): ICalcTransactionItem {
  return {
    quantity: new BigNumber(quantity),
    price: new BigNumber(price),
    date: new Date(nextDate()),
  };
}