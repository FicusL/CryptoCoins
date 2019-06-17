import { IReferralOptionsObject } from '../types/referral-options-object.interface';

export class OutSettingsReferralDTO implements IReferralOptionsObject {
  exchangeCommissionCoefficient: string;

  constructor(data: IReferralOptionsObject) {
    Object.assign(this, data);
  }
}