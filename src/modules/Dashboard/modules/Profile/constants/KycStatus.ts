export enum KycStatus {
  Unapproved = 'unapproved',
  Tier1Pending = 'tier1_pending',
  Tier1Rejected = 'tier1_rejected',
  Tier1Approved = 'tier1_approved',
  Tier2Rejected = 'tier2_rejected',
  Tier2Approved = 'tier2_approved',
  Tier3Rejected = 'tier3_rejected',
  Tier3Approved = 'tier3_approved',
}

export const KycStatusValues  = {
  [KycStatus.Unapproved]: 'Unapproved',
  [KycStatus.Tier1Approved]: 'Tier 1',
  [KycStatus.Tier1Pending]: 'Tier 1 Pending',
  [KycStatus.Tier1Rejected]: 'Tier 1 Rejected',
  [KycStatus.Tier2Rejected]: 'Tier 2 Rejected',
  [KycStatus.Tier2Approved]: 'Tier 2',
  [KycStatus.Tier3Rejected]: 'Tier 3 Rejected',
  [KycStatus.Tier3Approved]: 'Tier 3',
};