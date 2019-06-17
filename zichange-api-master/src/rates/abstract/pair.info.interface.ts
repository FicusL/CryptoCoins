import { BigNumber } from 'bignumber.js';

export interface IPairInfo {
  bid1: BigNumber;
  bid2: BigNumber;
  ask1: BigNumber;
  ask2: BigNumber;
  change24Hour1: BigNumber;
  change24Hour2: BigNumber;
}