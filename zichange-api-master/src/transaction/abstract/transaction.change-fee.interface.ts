import { BigNumber } from 'bignumber.js';

export interface ITransactionChangeFee {
  depositFeeAmount?: BigNumber;
  exchangeFeeAmount?: BigNumber;
  withdrawalFeeAmount?: BigNumber;
}