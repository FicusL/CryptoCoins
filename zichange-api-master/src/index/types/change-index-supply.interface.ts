import { IndexEntity } from '../entity/index.entity';
import { BigNumber } from 'bignumber.js';

export interface IChangeIndexSupply {
  index: IndexEntity;
  oldSupply: BigNumber;
  newSupply: BigNumber;
}