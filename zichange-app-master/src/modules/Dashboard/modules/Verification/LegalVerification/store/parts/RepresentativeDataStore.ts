import {
  IsAlpha,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  Matches,
  MaxDate,
  MinDate,
  ValidateIf,
} from 'class-validator';
import { BaseFormStore, IValues } from '../../../../../../Shared/stores/Forms/BaseFormStore';
import { ClassType } from 'class-transformer/ClassTransformer';
import moment from 'moment';
import { action } from 'mobx';

export class RepresentativeDataValues implements IValues {
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @IsAlpha({ message: 'dashboard.kyc.validate.onlyLatin' })
  firstName: string;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @IsAlpha({ message: 'dashboard.kyc.validate.onlyLatin' })
  lastName: string;
  
  @IsOptional()
  personalCode: string;
  
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @MinDate(moment().subtract(150, 'years').toDate(), { message: 'dashboard.kyc.validate.invalidDate' })
  @MaxDate(moment().subtract(18, 'years').toDate(), { message: 'dashboard.kyc.validate.mustBeAtLeastEighteenYearsOld' })
  @IsDate({ message: 'dashboard.kyc.validate.invalidDate' })
  dateOfBirth: Date;
  
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  country: string;
  
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  countryOfResidence: string;
  
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @Matches(/[0-9,A-Za-z]*[$@!%*?#&_()~+,-/:;'\]"\\^`{|}<=>[\s]*/,
    { message: 'dashboard.kyc.validate.latinNumbersSpecialCharacters'},
  )
  addressOfResidence: string;
  
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  idType: string;
  
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @IsNumberString({ message: 'dashboard.kyc.validate.mustBeNumber' })
  idNumber: string;
  
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  issuingCountry: string;
  
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @MaxDate(new Date(), { message: 'dashboard.kyc.validate.invalidDate' })
  @IsDate({ message: 'dashboard.kyc.validate.invalidDate' })
  issueDate: Date;
  
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @MinDate(new Date(), { message: 'dashboard.kyc.validate.invalidDate' })
  @IsDate({ message: 'dashboard.kyc.validate.invalidDate' })
  expirationDate: Date;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @Matches(/[0-9,A-Za-z]*[$@!%*?#&_()~+,-/:;'\]"\\^`{|}<=>[\s]*/,
    { message: 'dashboard.kyc.validate.latinNumbersSpecialCharacters'},
  )
  position: string;
  
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  contactPhone: string;
  
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @IsEmail(undefined, { message: 'dashboard.kyc.validate.invalidEmail' })
  representativeEmail: string;
  
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  politicallyExposed: string;

  @ValidateIf((o: RepresentativeDataValues) => o.politicallyExposed === 'yes')
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @Matches(/[0-9,A-Za-z]*[$@!%*?#&_()~+,-/:;'\]"\\^`{|}<=>[\s]*/,
    { message: 'dashboard.kyc.validate.latinNumbersSpecialCharacters'},
  )
  politicallyExposedName: string;

  @ValidateIf((o: RepresentativeDataValues) => o.politicallyExposed === 'yes')
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @Matches(/[0-9,A-Za-z]*[$@!%*?#&_()~+,-/:;'\]"\\^`{|}<=>[\s]*/,
    { message: 'dashboard.kyc.validate.latinNumbersSpecialCharacters'},
  )
  politicallyExposedPosition: string;

  @ValidateIf((o: RepresentativeDataValues) => o.politicallyExposed === 'yes')
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  politicallyExposedRelation: string;
}

export class RepresentativeDataStore extends BaseFormStore<RepresentativeDataValues> {
  get type(): ClassType<RepresentativeDataValues> {
    return RepresentativeDataValues;
  }

  protected getInitialValues(): IValues<RepresentativeDataValues> {
    return {};
  }

  // @action
  // loadLocalStorage() {
  //   const getCacheItem = (name: string) => window.localStorage.getItem(name);
  //   const getValue = (name: string) => (getCacheItem(name) || null);
  //
  //   this.values.firstName = getValue('firstName');
  //   this.values.lastName = getValue('lastName');
  //   this.values.contactPhone = getValue('contactPhone');
  //   this.values.addressOfResidence = getValue('addressOfResidence');
  //   this.values.country = getValue('country');
  //   this.values.countryOfResidence = getValue('countryOfResidence');
  //   this.values.dateOfBirth = new Date(getCacheItem('dateOfBirth')) || new Date();
  //   this.values.expirationDate = new Date(getCacheItem('expirationDate')) || new Date();
  //   this.values.idNumber = getValue('idNumber');
  //   this.values.idType = getValue('idType');
  //   this.values.issueDate = new Date(getCacheItem('issueDate')) || new Date();
  //   this.values.issuingCountry = getValue('issuingCountry');
  //   this.values.personalCode = getValue('personalCode');
  //   this.values.politicallyExposed = getValue('politicallyExposed');
  //   this.values.politicallyExposedName = getValue('politicallyExposedName');
  //   this.values.politicallyExposedPosition = getValue('politicallyExposedPosition');
  //   this.values.politicallyExposedRelation = getValue('politicallyExposedRelation');
  //   this.values.position = getValue('position');
  //   this.values.representativeEmail = getValue('representativeEmail');
  //
  // }
}
