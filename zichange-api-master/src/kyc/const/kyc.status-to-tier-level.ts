import {KycStatus} from './kyc.status';
import {KycTierLevel} from './kyc.tier-level.enum';

export const KYCStatusToTierLevel: Record<KycStatus, KycTierLevel> = {
  [KycStatus.Unapproved]: KycTierLevel.None,
  [KycStatus.Tier1Pending]: KycTierLevel.None,
  [KycStatus.Tier1Rejected]: KycTierLevel.None,

  [KycStatus.Tier1Approved]: KycTierLevel.Tier1,
  [KycStatus.Tier2Rejected]: KycTierLevel.Tier1,

  [KycStatus.Tier2Approved]: KycTierLevel.Tier2,
  [KycStatus.Tier3Rejected]: KycTierLevel.Tier2,

  [KycStatus.Tier3Approved]: KycTierLevel.Tier3,
};

export const KYCStatusToTierLevelForCounterpartyTransactions: Record<KycStatus, KycTierLevel> = {
  [KycStatus.Unapproved]: KycTierLevel.Tier1,
  [KycStatus.Tier1Pending]: KycTierLevel.Tier1,
  [KycStatus.Tier1Rejected]: KycTierLevel.Tier1,

  [KycStatus.Tier1Approved]: KycTierLevel.Tier1,
  [KycStatus.Tier2Rejected]: KycTierLevel.Tier1,

  [KycStatus.Tier2Approved]: KycTierLevel.Tier2,
  [KycStatus.Tier3Rejected]: KycTierLevel.Tier2,

  [KycStatus.Tier3Approved]: KycTierLevel.Tier3,
};
