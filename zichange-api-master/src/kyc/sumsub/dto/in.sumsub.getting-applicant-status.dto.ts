import { SumsubReviewStatuses } from '../types/sumsub.review-statuses';
import { SumsubSupportedDocumentTypes } from '../types/sumsub.supported-document-types';
import { SumsubDocSubType } from '../const/sumsub.doc-sub-type';
import { SumsubReviewRejectType } from '../const/sumsub.review-reject-type.enum';

export enum SumSubVerificationLabels {
  GREEN	= 'GREEN',
  RED = 'RED',
}

export class InSumsubGettingApplicantStatusReviewResultDTO {
  moderationComment?: string;
  clientComment?: string;
  reviewAnswer: SumSubVerificationLabels;
  rejectLabels?: string[];
  reviewRejectType?: SumsubReviewRejectType;
}

export class InSumsubGettingApplicantStatusStatusDTO {
  id: string;
  inspectionId: string;
  applicantId: string;
  jobId: string;
  createDate: string;
  startDate?: string;
  reviewDate?: string;
  reviewResult?: InSumsubGettingApplicantStatusReviewResultDTO;
  reviewStatus: SumsubReviewStatuses;
  notificationFailureCnt: number;
}

export class InSumsubGettingApplicantStatusDocumentItemDTO {
  idDocType: SumsubSupportedDocumentTypes;
  idDocSubType?: SumsubDocSubType;
  country: string;
  imageId: number;
  addedDate: string;
  reviewResult?: {
    moderationComment?: string;
    clientComment?: string;
    reviewAnswer: SumSubVerificationLabels;
  };
}

export class InSumsubGettingApplicantStatusDTO {
  id: string;
  status: InSumsubGettingApplicantStatusStatusDTO;
  documentStatus?: InSumsubGettingApplicantStatusDocumentItemDTO[];
}