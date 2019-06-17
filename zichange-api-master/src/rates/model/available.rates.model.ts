import { BigNumber } from 'bignumber.js';
import { IRealtimeRateItem } from '../../realtime/abstract/realtime.rates-item.interface';

export class RateModel {
  readonly directions: IRealtimeRateItem = {
    'BTC-EUR': new BigNumber(NaN),
    'EUR-BTC': new BigNumber(NaN),
  };

  isValid(options?: { canNegative?: boolean }) {
    let canNegative = false;
    if (options && options.canNegative) {
      canNegative = true;
    }

    const directions = Object.getOwnPropertyNames(this.directions);
    for (const direction of directions) {
      const value = this.directions[direction] as BigNumber;

      if (!value || value.isNaN() || !value.isFinite()) {
        return false;
      }

      if (value.isNegative() && !canNegative) {
        return false;
      }
    }

    return true;
  }
}