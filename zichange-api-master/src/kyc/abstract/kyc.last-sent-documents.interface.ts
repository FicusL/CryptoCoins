import { InSumsubGettingApplicantStatusDocumentItemDTO } from '../sumsub/dto/in.sumsub.getting-applicant-status.dto';

export interface ILastSentDocuments {
  lastSelfie: InSumsubGettingApplicantStatusDocumentItemDTO | undefined;
  lastDocumentFront: InSumsubGettingApplicantStatusDocumentItemDTO | undefined;
  lastDocumentBack: InSumsubGettingApplicantStatusDocumentItemDTO | undefined;
}