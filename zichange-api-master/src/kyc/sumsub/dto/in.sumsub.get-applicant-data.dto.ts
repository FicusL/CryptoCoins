import { SumSubVerificationLabels } from './in.sumsub.getting-applicant-status.dto';
import { SumsubReviewStatuses } from '../types/sumsub.review-statuses';
import { SumsubSupportedDocumentTypes } from '../types/sumsub.supported-document-types';
import { SumsubCreateApplicantDocTypes } from '../types/create-applicant/sumsub.create-applicant-doc.types';
import { SumsubDocSubType } from '../const/sumsub.doc-sub-type';

// NOTE: this DTO contains not all fields

export class InSumsubGetApplicantDataListItemInfoDocItemDTO {
  idDocType: SumsubSupportedDocumentTypes;
  country: string;
  number: string;
}

export class InSumsubGetApplicantDataListItemInfoDTO {
  idDocs?: InSumsubGetApplicantDataListItemInfoDocItemDTO[];
}

export class InSumsubGetApplicantDataListItemReviewReviewResultDTO {
  moderationComment?: string;
  clientComment?: string;
  reviewAnswer: SumSubVerificationLabels;
}

export class InSumsubGetApplicantDataListItemReviewDTO {
  reviewResult: InSumsubGetApplicantDataListItemReviewReviewResultDTO;
  reviewStatus: SumsubReviewStatuses;
}

export class InSumsubGetApplicantDataListItemRequiredIdDocsSetDTO {
  idDocSetType: SumsubCreateApplicantDocTypes;
  types: SumsubSupportedDocumentTypes[];
  subTypes?: SumsubDocSubType[];
}

export class InSumsubGetApplicantDataListItemRequiredIdDocsDTO {
  country: string;
  docSets: InSumsubGetApplicantDataListItemRequiredIdDocsSetDTO[];
}

export class InSumsubGetApplicantDataListItemDTO {
  id: string;
  info: InSumsubGetApplicantDataListItemInfoDTO;
  review: InSumsubGetApplicantDataListItemReviewDTO;
  requiredIdDocs: InSumsubGetApplicantDataListItemRequiredIdDocsDTO;
}

export class InSumsubGetApplicantDataListDTO {
  items: InSumsubGetApplicantDataListItemDTO[];
  totalItems: number;
}

export class InSumsubGetApplicantDataDTO {
  list: InSumsubGetApplicantDataListDTO;
}