import { ISumsubAddingDocumentMetadataRequest } from '../types/adding-document/sumsub.adding-document-metadata-request.interface';
import { ISumsubAddingDocumentMetadata } from '../types/adding-document/sumsub.adding-document-metadata.interface';
import { ISumsubCreateApplicantBody } from '../types/create-applicant/sumsub.create-applicant-body.interface';
import { InKycNaturalCreateDto } from '../../dto/natural/in.kyc.natural.create.dto';
import { SumsubSupportedDocumentTypes } from '../types/sumsub.supported-document-types';
import { SumsubCreateApplicantDocTypes } from '../types/create-applicant/sumsub.create-applicant-doc.types';
import { SumsubAvailableIdentityDocTypes } from '../const/sumsub.available-identity-doc-types';
import { innerCountryToSumSub } from '../../../core/util/country-utils';
import { KycDocumentType } from '../../const/kyc.document.type';
import { ISumsubCreateApplicantRequiredDocs } from '../types/create-applicant/sumsub-create-applicant-required-docs.interface';

export function convertInnerDocumentTypeToSumSub(docType: KycDocumentType): SumsubSupportedDocumentTypes {
  const record: Record<KycDocumentType, SumsubSupportedDocumentTypes> = {
    PASSPORT: SumsubSupportedDocumentTypes.PASSPORT,
    DRIVERS: SumsubSupportedDocumentTypes.DRIVERS,
    ID_CARD: SumsubSupportedDocumentTypes.ID_CARD,
    RESIDENCE_PERMIT: SumsubSupportedDocumentTypes.RESIDENCE_PERMIT,
  };

  return record[docType];
}

export function SumsubConvertAddingDocumentMetadataToRequest(metadata: ISumsubAddingDocumentMetadata): ISumsubAddingDocumentMetadataRequest {
  return {
    idDocType: metadata.idDocType,
    idDocSubType: metadata.idDocSubType,
    country: innerCountryToSumSub(metadata.country),
    firstName: metadata.firstName,
    middleName: metadata.middleName,
    lastName: metadata.lastName,
    issuedDate: metadata.issuedDate ? convertDateForSumSubFormat(metadata.issuedDate) : undefined,
    validUntil: metadata.validUntil ? convertDateForSumSubFormat(metadata.validUntil) : undefined,
    number: metadata.number,
    dob: metadata.dob ? convertDateForSumSubFormat(metadata.dob) : undefined,
    placeOfBirth: metadata.placeOfBirth,
  };
}

export function naturalKycDtoToCreateApplicantBody(dto: InKycNaturalCreateDto): ISumsubCreateApplicantBody {
  return {
    email: dto.personalInformation.email,
    info: {
      firstName: dto.personalInformation.firstName,
      middleName: dto.personalInformation.middleName,
      lastName: dto.personalInformation.lastName,
      dob: convertDateForSumSubFormat(new Date(dto.personalInformation.birthDate)),
      countryOfBirth: innerCountryToSumSub(dto.personalInformation.country),
      gender: dto.personalInformation.gender,
      phone: dto.personalInformation.contactPhone,
      country: innerCountryToSumSub(dto.personalInformation.country),
      addresses: [
        {
          country: innerCountryToSumSub(dto.personalInformation.residenceCountry),
          town: dto.personalInformation.city,
          street: dto.personalInformation.address1,
          flatNumber: dto.personalInformation.address2,
          postCode: dto.personalInformation.zipOrPostalCode,
        },
      ],
    },
    metadata: [
      {
        key: 'TAX_RESIDENCY_COUNTRY',
        value: innerCountryToSumSub(dto.personalInformation.TaxResidenceCountry),
      },
      {
        key: 'BENEFICIARIES_representedByThirdParty',
        value: dto.beneficiariesAndRepresentatives.representedByThirdParty,
      },
      {
        key: 'BENEFICIARIES_beneficFirstName3Party',
        value: dto.beneficiariesAndRepresentatives.beneficFirstName3Party,
      },
      {
        key: 'BENEFICIARIES_beneficLastName3Party',
        value: dto.beneficiariesAndRepresentatives.beneficLastName3Party,
      },
      {
        key: 'BENEFICIARIES_beneficBirthDate3Party',
        value: convertDateForSumSubFormat(new Date(dto.beneficiariesAndRepresentatives.beneficBirthDate3Party)) || '',
      },
      {
        key: 'BENEFICIARIES_basisPowerAttorney',
        value: dto.beneficiariesAndRepresentatives.basisPowerAttorney,
      },
      {
        key: 'BENEFICIARIES_fieldPowerAttorney',
        value: dto.beneficiariesAndRepresentatives.fieldPowerAttorney,
      },
      {
        key: 'BENEFICIARIES_termPowerAttorney',
        value: dto.beneficiariesAndRepresentatives.termPowerAttorney,
      },
      {
        key: 'BENEFICIARIES_ultimateBeneficiary',
        value: dto.beneficiariesAndRepresentatives.ultimateBeneficiary,
      },
      {
        key: 'BENEFICIARIES_beneficFirstNameUltBeneficiary',
        value: dto.beneficiariesAndRepresentatives.beneficFirstNameUltBeneficiary,
      },
      {
        key: 'BENEFICIARIES_beneficLastNameUltBeneficiary',
        value: dto.beneficiariesAndRepresentatives.beneficLastNameUltBeneficiary,
      },
      {
        key: 'BENEFICIARIES_personalCode',
        value: dto.beneficiariesAndRepresentatives.personalCode,
      },
      {
        key: 'BENEFICIARIES_beneficBirthDateUltBeneficiary',
        value: convertDateForSumSubFormat(new Date(dto.beneficiariesAndRepresentatives.beneficBirthDateUltBeneficiary)) || '',
      },
      {
        key: 'BENEFICIARIES_beneficBirthPlace',
        value: dto.beneficiariesAndRepresentatives.beneficBirthPlace,
      },
      {
        key: 'BENEFICIARIES_beneficResidenceCountry',
        value: innerCountryToSumSub(dto.beneficiariesAndRepresentatives.beneficResidenceCountry),
      },
      {
        key: 'BENEFICIARIES_PEP',
        value: dto.beneficiariesAndRepresentatives.PEP,
      },
      {
        key: 'BENEFICIARIES_officialFullName',
        value: dto.beneficiariesAndRepresentatives.officialFullName,
      },
      {
        key: 'BENEFICIARIES_officialPosition',
        value: dto.beneficiariesAndRepresentatives.officialPosition,
      },
      {
        key: 'BENEFICIARIES_politicallyExposedRelation',
        value: dto.beneficiariesAndRepresentatives.politicallyExposedRelation,
      },
    ],
    requiredIdDocs: naturalKycCreateApplicantRequiredDocs(dto),
  };
}

export function naturalKycCreateApplicantRequiredDocs(dto: InKycNaturalCreateDto): ISumsubCreateApplicantRequiredDocs {
  return {
    country: innerCountryToSumSub(dto.personalInformation.country),
    docSets: [
      {
        idDocSetType: SumsubCreateApplicantDocTypes.SELFIE,
        types: [ SumsubSupportedDocumentTypes.SELFIE ],
      },
      {
        idDocSetType: SumsubCreateApplicantDocTypes.IDENTITY,
        subTypes: dto.personalInformation.documentIsDoubleSided ? [ 'FRONT_SIDE', 'BACK_SIDE' ] : undefined,
        types: SumsubAvailableIdentityDocTypes,
      },
    ],
  };
}

/**
 * Converted Date to string format: YYYY-mm-dd
 */
export function convertDateForSumSubFormat(date: Date) {
  try {
    return date.toISOString().split('T')[0];
  } catch (e) {
    return undefined;
  }
}