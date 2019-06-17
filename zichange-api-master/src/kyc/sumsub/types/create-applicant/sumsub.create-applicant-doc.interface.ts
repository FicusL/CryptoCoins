import { SumsubSupportedDocumentTypes } from '../sumsub.supported-document-types';
import { SumsubCreateApplicantDocTypes } from './sumsub.create-applicant-doc.types';
import { SumsubDocSubType } from '../../const/sumsub.doc-sub-type';

export interface ISumsubCreateApplicantDoc {
  idDocSetType: SumsubCreateApplicantDocTypes;
  types: SumsubSupportedDocumentTypes[];
  subTypes?: SumsubDocSubType[];
}