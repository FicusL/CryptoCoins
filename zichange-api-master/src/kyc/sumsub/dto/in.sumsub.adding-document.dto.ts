import { SumsubSupportedDocumentTypes } from '../types/sumsub.supported-document-types';
import { SumsubDocSubType } from '../const/sumsub.doc-sub-type';

export class InSumsubAddingDocumentDTO {
  idDocType: SumsubSupportedDocumentTypes;
  idDocSubType?: SumsubDocSubType;
  country: string; // 3-letter country code. https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3
  firstName?: string;
  middleName?: string;
  lastName?: string;
  issuedDate?: string; // YYYY-mm-dd
  validUntil?: string; // YYYY-mm-dd
  number?: string;
  dob?: string; // Date of birth
  placeOfBirth?: string;
}