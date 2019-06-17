import * as dotenv from 'dotenv-safe';
dotenv.config({ allowEmptyValues: true });

import { ITestData } from '../common/types/test-data.interface';
import { initApplicationForTesting } from '../common/init-application-for-testing';
import { AccountEntity } from '../../src/account/entitiy/account.entity';
import { KycHelperService } from './kyc.helper.service';
import { AccountType } from '../../src/account/const/account.type.enum';
import { authorizeAccount } from '../common/authorize-account';
import { InKycNaturalBeneficiariesDto } from '../../src/kyc/dto/natural/parts/in.kyc.natural.beneficiaries.dto';
import { InKycNaturalPersonalDto } from '../../src/kyc/dto/natural/parts/in.kyc.natural.personal.dto';
import { KycDocumentType } from '../../src/kyc/const/kyc.document.type';
import { InKycLegalBeneficiariesDataDto } from '../../src/kyc/dto/legal/parts/in.kyc.legal.beneficiaries.data.dto';
import { InKycLegalCustomerInfoDto } from '../../src/kyc/dto/legal/parts/in.kyc.legal.customer.info.dto';
import { InKycLegalMainPartnersDto } from '../../src/kyc/dto/legal/parts/in.kyc.legal.main.partners.dto';
import { InKycLegalManagementPersonalDto } from '../../src/kyc/dto/legal/parts/in.kyc.legal.management.personal.dto';
import { InKycLegalOtherInfoDto } from '../../src/kyc/dto/legal/parts/in.kyc.legal.other.info.dto';
import { InKycLegalRepresentativeDto } from '../../src/kyc/dto/legal/parts/in.kyc.legal.representative.dto';
import { SumsubApiMock } from '../../src/kyc/sumsub/service/sumsub-api.mock';
import { SumsubApiBaseService } from '../../src/kyc/sumsub/service/sumsub-api.base.service';
import { KycTotalTurnover } from '../../src/kyc/const/kyc.total-turnover.enum';

jest.setTimeout(30 * 1000);

describe('KYC (e2e)', () => {
  let testData: ITestData;
  let kycHelperService: KycHelperService;
  let naturalAccount: AccountEntity;
  let naturalAccountPdf: AccountEntity;
  let naturalAccountWithoutFiles: AccountEntity;
  let naturalAccountWithFrontAndBackDocument: AccountEntity;
  let legalAccount: AccountEntity;

  beforeAll(async () => {
    process.env.USE_GOOGLE_CLOUD_STORAGE = 'false';
    process.env.MAILGUN_TEST_MODE = 'true';

    testData = await initApplicationForTesting({
      providers: [
        KycHelperService,
      ],
      prepareBuilder: async (builder) => {
        builder
          .overrideProvider(SumsubApiBaseService)
          .useClass(SumsubApiMock);
      },
    });

    kycHelperService = testData.moduleFixture.get<KycHelperService>(KycHelperService);
    naturalAccount = await kycHelperService.createAccountForTestKYC(AccountType.Natural);
    naturalAccountPdf = await kycHelperService.createAccountForTestKYC(AccountType.Natural);
    naturalAccountWithoutFiles = await kycHelperService.createAccountForTestKYC(AccountType.Natural);
    naturalAccountWithFrontAndBackDocument = await kycHelperService.createAccountForTestKYC(AccountType.Natural);
    legalAccount = await kycHelperService.createAccountForTestKYC(AccountType.LegalEntity);
  });

  it('/POST send KYC for natural account', async () => {
    await authorizeAccount({
      email: naturalAccount.email,
      password: KycHelperService.AccountPassword,
      agent: testData.agent,
    });

    return await testData.agent
      .post(`/account/${naturalAccount.id}/kyc/natural`)
      .field('beneficiariesAndRepresentatives', getBeneficiariesAndRepresentatives())
      .field('personalInformation', getPersonalInformation(naturalAccount, { documentIsDoubleSided: false }))
      .attach('identityDocument', './test/photos-for-kyc/identityDocument.png')
      .attach('selfie', './test/photos-for-kyc/selfie.png')
      .expect(201);
  });

  it('/POST send KYC for natural account with front and back document side', async () => {
    await authorizeAccount({
      email: naturalAccountWithFrontAndBackDocument.email,
      password: KycHelperService.AccountPassword,
      agent: testData.agent,
    });

    return await testData.agent
      .post(`/account/${naturalAccountWithFrontAndBackDocument.id}/kyc/natural`)
      .field('beneficiariesAndRepresentatives', getBeneficiariesAndRepresentatives())
      .field('personalInformation', getPersonalInformation(naturalAccountWithFrontAndBackDocument, { documentIsDoubleSided: true }))
      .attach('identityDocument', './test/photos-for-kyc/identityDocument.png')
      .attach('identityDocumentBack', './test/photos-for-kyc/identityDocumentBack.png')
      .attach('selfie', './test/photos-for-kyc/selfie.png')
      .expect(201);
  });

  it('/POST send KYC for natural account with PDF files', async () => {
    await authorizeAccount({
      email: naturalAccountPdf.email,
      password: KycHelperService.AccountPassword,
      agent: testData.agent,
    });

    return await testData.agent
      .post(`/account/${naturalAccountPdf.id}/kyc/natural`)
      .field('beneficiariesAndRepresentatives', getBeneficiariesAndRepresentatives())
      .field('personalInformation', getPersonalInformation(naturalAccountPdf, { documentIsDoubleSided: false }))
      .attach('identityDocument', './test/photos-for-kyc/identityDocument.pdf')
      .attach('selfie', './test/photos-for-kyc/selfie.pdf')
      .expect(201);
  });

  it('/POST send KYC for natural account without files. 403 expect', async () => {
    await authorizeAccount({
      email: naturalAccountWithoutFiles.email,
      password: KycHelperService.AccountPassword,
      agent: testData.agent,
    });

    return await testData.agent
      .post(`/account/${naturalAccountWithoutFiles.id}/kyc/natural`)
      .field('beneficiariesAndRepresentatives', getBeneficiariesAndRepresentatives())
      .field('personalInformation', getPersonalInformation(naturalAccountWithoutFiles, { documentIsDoubleSided: false }))
      .expect(400);
  });

  it('/POST send KYC for legal', async () => {
    await authorizeAccount({
      email: legalAccount.email,
      password: KycHelperService.AccountPassword,
      agent: testData.agent,
    });

    return await testData.agent
      .post(`/account/${legalAccount.id}/kyc/legal`)
      .field('beneficiariesData', getBeneficiariesData())
      .field('customerInformation', getCustomerInformation())
      .field('mainPartners', getMainPartners())
      .field('managementPersonalData', getManagementPersonalData())
      .field('otherInfo', getOtherInfo())
      .field('representativeData', getRepresentativeData())
      .expect(201);
  });

  afterAll(async () => {
    await testData.app.close();
  });
});

// region Helper functions for legal

function getBeneficiariesData(): string {
  return JSON.stringify({
    persons: [{
      birthDate: '10.10.1990',
      country: 'USA',
      firstName: 'First',
      lastName: 'Last',
      personalCode: 'code',
      politicallyExposed: 'politically_exposed',
      politicallyExposedName: 'politically_exposed_name',
      politicallyExposedPosition: 'politically_exposed_position',
      politicallyExposedRelation: 'politically_exposed_relation',
      residenceCountry: 'USA',
      addressOfResidence: 'address',
    }],
  } as InKycLegalBeneficiariesDataDto);
}

function getCustomerInformation(): string {
  return JSON.stringify({
    companyEmail: 'company@email.com',
    companyName: 'name',
    contactPhone: '88005553535',
    legalAddress: 'address',
    registrationDate: '10.10.1990',
    registrationNumber: '123456',
    webPage: 'https://127.0.0.0',
    countryOfRegistration: 'USA',
    correspondenceAddress: 'address',
    totalTurnover: KycTotalTurnover.Between1k_2k,
    fiatToCryptoExchange: false,
    cryptoToFiatExchange: true,
    cryptoToCryptoExchange: false,
    other: false,
    otherDetails: 'no',
    additionalOperationCountries: [],
    companyActivity: 'company_activity',
    companyStructure: 'company_structure',
    licenseOrRegistrationNumber: 'license_or_registration_number',
    operationCountry: 'USA',
    registeredOrLicensedActivity: 'registered or licensed activity',
    subsidiaryCompany: 'subsidiary company',
  } as InKycLegalCustomerInfoDto);
}

function getMainPartners(): string {
  return JSON.stringify({
    partners: [{
      activity: 'activity',
      name: 'name',
      regCountry: 'USA',
      regNumber: '123456',
    }],
  } as InKycLegalMainPartnersDto);
}

function getManagementPersonalData(): string {
  return JSON.stringify({
    persons: [{
      birthDate: '10.10.1990',
      country: 'USA',
      firstName: 'First',
      lastName: 'Last',
      personalCode: 'code',
      politicallyExposed: 'politically_exposed',
      politicallyExposedName: 'politically_exposed_name',
      politicallyExposedPosition: 'politically_exposed_position',
      politicallyExposedRelation: 'politically_exposed_relation',
      residenceCountry: 'USA',
      addressOfResidence: 'addressOfResidence',
    }],
  } as InKycLegalManagementPersonalDto);
}

function getOtherInfo(): string {
  return JSON.stringify({
    additionalInfo: 'additional info',
    confirm1: true,
    confirm2: true,
    confirm3: true,
    confirm4: true,
    costs: 'costs',
    incomeSource: 'source',
    internationalActivity: 'activity',
    structure: 'structure',
    workOffshore: 'work',
    confirm5: true,
    controlStructure: 'controlStructure',
    descriptionControlStructure: 'descriptionControlStructure',
    descriptionInternationalActivity: 'descriptionInternationalActivity',
    descriptionWorkOffshore: 'descriptionWorkOffshore',
  } as InKycLegalOtherInfoDto);
}

function getRepresentativeData(): string {
 return JSON.stringify({
   addressOfResidence: 'address',
   contactPhone: '88005553535',
   country: 'USA',
   countryOfResidence: 'USA',
   dateOfBirth: '10.10.1990',
   expirationDate: '10.10.2030',
   firstName: 'first',
   idNumber: '123456',
   idType: 'type',
   issueDate: '10.10.2030',
   issuingCountry: 'USA',
   issuingOrganization: 'organization',
   lastName: 'last',
   personalCode: '123456',
   politicallyExposed: 'exposed',
   politicallyExposedName: 'name',
   politicallyExposedPosition: 'position',
   politicallyExposedRelation: 'relation',
   position: 'position',
   representativeEmail: 'company@email.com',
 } as InKycLegalRepresentativeDto);
}

// endregion

// region Helper functions for natural

function getPersonalInformation(account: AccountEntity, options: { documentIsDoubleSided: boolean }): string {
  return JSON.stringify({
    gender: 'male',
    contactPhone: '123456789',
    TaxResidenceCountry: 'AFG',
    additionalCitizenship: [
      'address 1', 'address 2', 'address 3',
    ],
    zipOrPostalCode: 'zipOrPostalCode',
    address2: 'address2',
    address1: 'address1',
    city: 'city',
    stateOrProvince: 'stateOrProvince',
    residenceCountry: 'AFG',
    country: 'AFG',
    birthDate: ('10.10.1992' as any),
    lastName: 'lastName',
    middleName: 'middleName',
    firstName: 'firstName',
    email: account.email,
    documentType: KycDocumentType.PASSPORT,
    documentIsDoubleSided: options.documentIsDoubleSided,
  } as InKycNaturalPersonalDto);
}

function getBeneficiariesAndRepresentatives(): string {
  return JSON.stringify({
    officialPosition: 'officialPosition',
    officialFullName: 'officialFullName',
    PEP: 'PEP',
    termPowerAttorney: 'termPowerAttorney',
    fieldPowerAttorney: 'fieldPowerAttorney',
    basisPowerAttorney: 'basisPowerAttorney',
    beneficFirstName3Party: 'beneficFirstName3Party',
    representedByThirdParty: 'representedByThirdParty',
    personalCode: 'personalCode',
    beneficBirthDate3Party: ('10.10.1990' as any),
    beneficBirthDateUltBeneficiary: ('10.10.1991' as any),
    beneficBirthPlace: 'beneficBirthPlace',
    beneficFirstNameUltBeneficiary: 'beneficFirstNameUltBeneficiary',
    beneficLastName3Party: 'beneficLastName3Party',
    beneficLastNameUltBeneficiary: 'beneficLastNameUltBeneficiary',
    beneficResidenceCountry: 'AFG',
    politicallyExposedRelation: 'politicallyExposedRelation',
    ultimateBeneficiary: 'ultimateBeneficiary',
  } as InKycNaturalBeneficiariesDto);
}

// endregion