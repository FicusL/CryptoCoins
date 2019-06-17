import { BigNumber } from 'bignumber.js';

export interface ICalcTransactionItem {
  quantity: BigNumber;
  price: BigNumber;
  date: Date;
}