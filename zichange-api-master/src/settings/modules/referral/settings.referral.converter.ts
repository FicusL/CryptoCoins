import { BigNumber } from 'bignumber.js';
import { IReferralOptions } from './types/referral-options.interface';
import { IReferralOptionsObject } from './types/referral-options-object.interface';

export class SettingsReferralConverter {
  static convertFromObject(raw: IReferralOptionsObject): IReferralOptions {
    return {
      exchangeCommissionCoefficient: new BigNumber(raw.exchangeCommissionCoefficient),
    };
  }

  static convertToObject(data: IReferralOptions): IReferralOptionsObject {
    return {
      exchangeCommissionCoefficient: data.exchangeCommissionCoefficient.toString(),
    };
  }
}