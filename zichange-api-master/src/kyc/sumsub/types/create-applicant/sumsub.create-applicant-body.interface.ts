import { ISumsubCreateApplicantMetadata } from './sumsub.create-applicant-metadata.interface';
import { ISumsubCreateApplicantRequiredDocs } from './sumsub-create-applicant-required-docs.interface';
import { ISumsubCreateApplicantInfo } from './sumsub.create-applicant-info.interface';

export interface ISumsubCreateApplicantBody {
  externalUserId?: string;
  sourceKey?: string;
  email?: string;
  lang?: string;
  metadata?: ISumsubCreateApplicantMetadata[];
  requiredIdDocs?: ISumsubCreateApplicantRequiredDocs;
  info: ISumsubCreateApplicantInfo;
}