import { BigNumber } from 'bignumber.js';

export interface ITransactionChangeAmount {
  depositFromAmount?: BigNumber;
  exchangeFromAmount?: BigNumber;
  exchangeToAmount?: BigNumber;
  withdrawalFromAmount?: BigNumber;
}