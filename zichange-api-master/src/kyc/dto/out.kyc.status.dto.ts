import { KycStatus } from '../const/kyc.status';
import { KycEntity } from '../entity/kyc.entity';
import { SumsubReviewStatuses } from '../sumsub/types/sumsub.review-statuses';

export class OutKycStatusDto {
  id: number;
  status: KycStatus;
  rejectReason?: string;
  sumSubStatus?: SumsubReviewStatuses;

  constructor(kyc: KycEntity) {
    this.id = kyc.id;
    this.status = kyc.status;
    this.rejectReason = kyc.rejectReason;
    this.sumSubStatus = kyc.sumSubStatus;
  }
}