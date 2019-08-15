import { ClassType } from 'class-transformer/ClassTransformer';
import { BaseFormStore, IValues } from '../../../../../../Shared/stores/Forms/BaseFormStore';
import { IsAlpha, IsDate, IsNotEmpty, IsOptional, MaxDate, MinDate, ValidateIf } from 'class-validator';
import moment from 'moment';
import { action } from 'mobx';
import { KycDataStore } from '../KycDataStore';
import { inject } from 'inversify';

export class BeneficiariesAndRepresentativesValues implements IValues {
  @IsNotEmpty()
  representedByThirdParty: string;

  @ValidateIf(o => o.representedByThirdParty === 'yes')
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @IsAlpha({ message: 'dashboard.kyc.onlyLatinCharacters' })
  beneficFirstName3Party: string;

  @ValidateIf(o => o.representedByThirdParty === 'yes')
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @IsAlpha({ message: 'dashboard.kyc.onlyLatinCharacters'})
  beneficLastName3Party: string;

  @ValidateIf(o => o.representedByThirdParty === 'yes')
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @MinDate(moment().subtract(150, 'years').toDate(), { message: 'dashboard.kyc.invalidDate' })
  @MaxDate(moment().subtract(18, 'years').toDate(), { message: 'dashboard.kyc.matureness' })
  @IsDate({ message: 'Invalid date' })
  beneficBirthDate3Party: Date;

  @ValidateIf(o => o.representedByThirdParty === 'yes')
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  basisPowerAttorney: string;

  @ValidateIf(o => o.representedByThirdParty === 'yes')
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  fieldPowerAttorney: string;

  @ValidateIf(o => o.representedByThirdParty === 'yes')
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  termPowerAttorney: string;

  @IsNotEmpty()
  ultimateBeneficiary: string;

  @ValidateIf(o => o.ultimateBeneficiary === 'no')
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @IsAlpha({ message: 'dashboard.kyc.onlyLatinCharacters'})
  beneficFirstNameUltBeneficiary: string;

  @ValidateIf(o => o.ultimateBeneficiary === 'no')
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @IsAlpha({ message: 'dashboard.kyc.onlyLatinCharacters'})
  beneficLastNameUltBeneficiary: string;

  @ValidateIf(o => o.ultimateBeneficiary === 'no')
  @IsOptional()
  personalCode: string;

  @ValidateIf(o => o.ultimateBeneficiary === 'no')
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @MinDate(moment().subtract(150, 'years').toDate(), { message: 'dashboard.kyc.invalidDate' })
  @MaxDate(moment().subtract(18, 'years').toDate(), { message: 'dashboard.kyc.matureness' })
  @IsDate({ message: 'Invalid date' })
  beneficBirthDateUltBeneficiary: Date;

  @ValidateIf(o => o.ultimateBeneficiary === 'no')
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  beneficBirthPlace: string;

  @ValidateIf(o => o.ultimateBeneficiary === 'no')
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  beneficResidenceCountry: string;

  @IsNotEmpty()
  PEP: string;

  @ValidateIf(o => o.PEP === 'yes')
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  officialFullName: string;

  @ValidateIf(o => o.PEP === 'yes')
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  officialPosition: string;

  @ValidateIf(o => o.PEP === 'yes')
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  politicallyExposedRelation: string;
}

export class BeneficiariesAndRepresentativesStore extends BaseFormStore<BeneficiariesAndRepresentativesValues> {
  get type(): ClassType<BeneficiariesAndRepresentativesValues> {
    return BeneficiariesAndRepresentativesValues;
  }

  @inject(KycDataStore)
  kycDataStore: KycDataStore;

  @action
  loadLocalStorage() {
    const getCacheItem = (name: string) => window.localStorage.getItem(name);
    const kycData = () => (this.kycDataStore.kycData.beneficiariesAndRepresentatives || {});
    const getValue = (name: string) => (getCacheItem(name) || kycData[name] || null);

    this.values.representedByThirdParty = getValue('representedByThirdParty');
    this.values.beneficFirstName3Party = getValue('beneficFirstName3Party');
    this.values.beneficLastName3Party = getValue('beneficLastName3Party');
    this.values.beneficBirthDate3Party = new Date(getCacheItem('beneficBirthDate3Party'))
      || kycData['beneficBirthDate3Party'] || new Date();
    this.values.basisPowerAttorney = getValue('basisPowerAttorney');
    this.values.fieldPowerAttorney = getValue('fieldPowerAttorney');
    this.values.termPowerAttorney = getValue('termPowerAttorney');
    this.values.ultimateBeneficiary = getValue('ultimateBeneficiary');
    this.values.beneficFirstNameUltBeneficiary = getValue('beneficFirstNameUltBeneficiary');
    this.values.beneficBirthDateUltBeneficiary = new Date(getCacheItem('beneficBirthDateUltBeneficiary'))
      || kycData['beneficBirthDateUltBeneficiary'] || new Date();
    this.values.beneficLastNameUltBeneficiary = getValue('beneficLastNameUltBeneficiary');
    this.values.beneficBirthPlace = getValue('beneficBirthPlace');
    this.values.personalCode = getValue('personalCode');
    this.values.beneficResidenceCountry = getValue('beneficResidenceCountry');
    this.values.PEP = getValue('PEP');
    this.values.officialFullName = getValue('officialFullName');
    this.values.officialPosition = getValue('officialPosition');
    this.values.politicallyExposedRelation = getValue('politicallyExposedRelation');
  }
}
