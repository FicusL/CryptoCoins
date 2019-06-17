import { ValueTransformer } from 'typeorm/decorator/options/ValueTransformer';
import { BigNumber } from 'bignumber.js';

export class BigNumberValueTransformer implements ValueTransformer {
  constructor(precision: number = 128) {
    this._precision = precision;
  }

  from(value: string): BigNumber {
    return new BigNumber(value);
  }

  to(value: BigNumber): string {
    if (!value) {
      return '0';
    }

    return value.toFixed(this._precision);
  }

  private _precision: number;
}