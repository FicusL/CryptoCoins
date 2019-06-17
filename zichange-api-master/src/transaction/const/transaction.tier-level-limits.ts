import { BigNumber } from 'bignumber.js';
import { KycTierLevel } from '../../kyc/const/kyc.tier-level.enum';

export const TransactionTierLevelLimits = {
  [KycTierLevel.None]: new BigNumber(0),
  [KycTierLevel.Tier1]: new BigNumber('15000'),
  [KycTierLevel.Tier2]: new BigNumber('100000'),
  [KycTierLevel.Tier3]: new BigNumber(Infinity),
};