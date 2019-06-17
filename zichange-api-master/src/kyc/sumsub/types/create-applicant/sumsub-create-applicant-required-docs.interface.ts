import { ISumsubCreateApplicantDoc } from './sumsub.create-applicant-doc.interface';

export interface ISumsubCreateApplicantRequiredDocs {
  country?: string;
  docSets: ISumsubCreateApplicantDoc[];
}