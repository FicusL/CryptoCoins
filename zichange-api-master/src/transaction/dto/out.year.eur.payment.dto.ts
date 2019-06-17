import { BigNumber } from 'bignumber.js';

export class OutYearEURPaymentDTO {
  yearEURPayment: string;

  constructor(yearEURPayment: BigNumber) {
    this.yearEURPayment = yearEURPayment.toString();
  }
}