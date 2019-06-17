import { SumsubReviewStatuses } from '../types/sumsub.review-statuses';

export class InSumsubCreateApplicantReviewDTO {
  createDate: string;
  reviewStatus: SumsubReviewStatuses;
  notificationFailureCnt: number;
}