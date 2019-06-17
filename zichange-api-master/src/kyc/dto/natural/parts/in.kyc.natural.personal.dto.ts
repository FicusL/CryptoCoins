import { IsBoolean, IsDate, IsEmail, IsEnum, IsNotEmpty, IsNumberString, IsOptional, MaxDate, MinDate } from 'class-validator';
import { IsAlphanumeric } from 'class-validator';
import moment = require('moment');
import { KycDocumentType } from '../../../const/kyc.document.type';

export class InKycNaturalPersonalDto {
  public static NON_VALIDATION_OCCUPATIONS = new Set(['unemployed', 'homemaker', 'retired', 'selfEmployed']);

  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsOptional()
  middleName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @IsNotEmpty({ message: 'Email required '})
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Phone is required' })
  @IsNumberString({ message: 'Invalid phone number' })
  contactPhone: string;

  @IsNotEmpty({ message: 'Birth date is required' })
  @MinDate(moment().subtract(150, 'years').toDate(), { message: 'Invalid date' })
  @MaxDate(moment().subtract(18, 'years').toDate(), { message: 'You must be at least 18 years old' })
  @IsDate({ message: 'Invalid date' })
  birthDate: Date;

  @IsNotEmpty({ message: 'Country is required' })
  country: string;

  @IsNotEmpty({ message: 'Gender is required' })
  gender: string;

  @IsNotEmpty({ message: 'Country of residence is required' })
  residenceCountry: string;

  @IsNotEmpty({ message: 'State/Province is required' })
  stateOrProvince: string;

  @IsNotEmpty({ message: 'City is required' })
  city: string;

  @IsNotEmpty({ message: 'Address is required' })
  address1: string;

  @IsOptional()
  address2: string;

  @IsNotEmpty({ message: 'Zip/Postal Code is required' })
  @IsAlphanumeric({ message: 'Zip/Postal Code must be alphanumeric string' })
  zipOrPostalCode: string;

  @IsOptional()
  additionalCitizenship: string[];

  @IsNotEmpty({ message: 'Country is required' })
  TaxResidenceCountry: string;

  @IsEnum(KycDocumentType)
  documentType: KycDocumentType;

  @IsBoolean()
  documentIsDoubleSided: boolean;
}