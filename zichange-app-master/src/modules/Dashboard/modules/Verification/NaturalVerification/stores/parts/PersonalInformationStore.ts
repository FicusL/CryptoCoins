import {
  IsAlphanumeric,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  MaxDate,
  MinDate,
} from 'class-validator';
import { BaseFormStore, IValues } from '../../../../../../Shared/stores/Forms/BaseFormStore';
import { ClassType } from 'class-transformer/ClassTransformer';
import moment from 'moment';
import { action } from 'mobx';
import { KycDataStore } from '../KycDataStore';
import { inject } from 'inversify';

export class PersonalInformationValues implements IValues {
  public static NON_VALIDATION_OCCUPATIONS = new Set(['unemployed', 'homemaker', 'retired', 'selfEmployed']);

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  firstName: string;

  @IsOptional()
  middleName: string;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  lastName: string;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired'})
  email: string;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @IsNumberString({ message: 'dashboard.kyc.invalidPhoneNumber' })
  contactPhone: string;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @MinDate(moment().subtract(150, 'years').toDate(), { message: 'dashboard.kyc.invalidDate' })
  @MaxDate(moment().subtract(18, 'years').toDate(), { message: 'dashboard.kyc.matureness' })
  @IsDate({ message: 'dashboard.kyc.invalidDate' })
  birthDate: Date;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  country: string;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  gender: string;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  residenceCountry: string;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  stateOrProvince: string;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  city: string;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  address1: string;

  @IsOptional()
  address2: string;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @IsAlphanumeric({ message: 'dashboard.kyc.zipPostalCode' })
  zipOrPostalCode: string;

  @IsOptional()
  additionalCitizenship: string[];

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  TaxResidenceCountry: string;
}

export class PersonalInformationStore extends BaseFormStore<PersonalInformationValues> {
  get type(): ClassType<PersonalInformationValues> {
    return PersonalInformationValues;
  }

  @inject(KycDataStore)
  kycDataStore: KycDataStore;

  @action
  loadLocalStorage() {
    const getCacheItem = (name: string) => window.localStorage.getItem(name);
    const kycData = () => (this.kycDataStore.kycData.personalInfromation || {});
    const getValue = (name: string) => (getCacheItem(name) || kycData[name] || null);

    this.values.firstName = getValue('firstName');
    this.values.middleName = getValue('middleName');
    this.values.lastName = getValue('lastName');
    this.values.birthDate = new Date(getCacheItem('birthDate'))
      || kycData['birthDate'] || new Date();
    this.values.country = getValue('country');
    this.values.gender = getValue('gender');
    this.values.contactPhone = getValue('contactPhone');
    this.values.residenceCountry = getValue('residenceCountry');
    this.values.stateOrProvince = getValue('stateOrProvince');
    this.values.city = getValue('city');
    this.values.address1 = getValue('address1');
    this.values.address2 = getValue('address2');
    this.values.zipOrPostalCode = getValue('zipOrPostalCode');

    const additionalCitizenship = getValue('additionalCitizenship');
    const haveCitizenship = additionalCitizenship && additionalCitizenship.split(',')[0] !== '';
    this.values.additionalCitizenship = haveCitizenship
      ? getCacheItem('additionalCitizenship').split(',')
      : [];

    this.values.TaxResidenceCountry = getValue('TaxResidenceCountry');
  }
}