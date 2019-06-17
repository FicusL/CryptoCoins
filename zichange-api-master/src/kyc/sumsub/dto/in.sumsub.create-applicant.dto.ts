import { InSumsubCreateApplicantReviewDTO } from './in.sumsub.create-applicant-review.dto';

export class InSumsubCreateApplicantDTO {
  id: string;
  createdAt: string;
  clientId: string;
  inspectionId: string;
  jobId: string;
  info: object;
  env: string;
  review: InSumsubCreateApplicantReviewDTO;
}