import { SumsubSupportedDocumentTypes } from '../sumsub.supported-document-types';
import { SumsubDocSubType } from '../../const/sumsub.doc-sub-type';

export interface ISumsubAddingDocumentMetadata {
  idDocType: SumsubSupportedDocumentTypes;
  idDocSubType?: SumsubDocSubType;
  country: string; // 3-letter country code. https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3
  firstName?: string;
  middleName?: string;
  lastName?: string;
  issuedDate?: Date;
  validUntil?: Date;
  number?: string;
  dob?: Date;
  placeOfBirth?: string;
}