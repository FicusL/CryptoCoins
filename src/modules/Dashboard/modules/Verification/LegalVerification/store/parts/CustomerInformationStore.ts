import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxDate,
  ValidateIf,
  Validator,
} from 'class-validator';
import { BaseFormStore, IValues } from '../../../../../../Shared/stores/Forms/BaseFormStore';
import { ClassType } from 'class-transformer/ClassTransformer';
import { action } from 'mobx';
import { injectable } from 'inversify';

export enum TotalTurnover {
  Less100 = 'Less100',
  Between100_500 = 'Between100_500',
  Between500_1k = 'Between500_1k',
  Between1k_2k = 'Between1k_2k',
  Between2k_10k = 'Between2k_10k',
  Between10k_50k = 'Between10k_50k',
  More50k = 'More50k',
}

export class CustomerInformationValues implements IValues {
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @Matches(/[0-9,A-Za-z]*[$@!%*?#&_()~+,-/:;'\]"\\^`{|}<=>[\s]*/,
    { message: 'dashboard.kyc.validate.latinNumbersSpecialCharacters'},
  )
  companyName: string;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  countryOfRegistration: string;

  @IsOptional()
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @Matches(/[0-9,A-Za-z]*[$@!%*?#&_()~+,-/:;'\]"\\^`{|}<=>[\s]*/,
    { message: 'dashboard.kyc.validate.latinNumbersSpecialCharacters'},
  )
  correspondenceAddress: string;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  registrationNumber: string;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @MaxDate(new Date(), { message: 'dashboard.kyc.validate.invalidDate' })
  @IsDate({ message: 'dashboard.kyc.validate.invalidDate' })
  registrationDate: Date;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @Matches(/[0-9,A-Za-z]*[$@!%*?#&_()~+,-/:;'\]"\\^`{|}<=>[\s]*/,
    { message: 'dashboard.kyc.validate.latinNumbersSpecialCharacters'},
  )
  legalAddress: string;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  contactPhone: string;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @IsEmail(undefined, { message: 'dashboard.kyc.validate.invalidEmail' })
  companyEmail: string;

  @IsOptional()
  webPage: string;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @Matches(/[0-9,A-Za-z]*[$@!%*?#&_()~+,-/:;'\]"\\^`{|}<=>[\s]*/,
    { message: 'dashboard.kyc.validate.latinNumbersSpecialCharacters'},
  )
  companyActivity: string;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  operationCountry: string;

  @IsOptional()
  additionalOperationCountries: [] = [];

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  registeredOrLicensedActivity: string;

  @ValidateIf((o: CustomerInformationValues) => o.registeredOrLicensedActivity === 'yes')
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @Matches(/[0-9,A-Za-z]*[$@!%*?#&_()~+,-/:;'\]"\\^`{|}<=>[\s]*/,
    { message: 'dashboard.kyc.validate.latinNumbersSpecialCharacters'},
  )
  licenseOrRegistrationNumber: string;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  subsidiaryCompany: string;

  @ValidateIf((o: CustomerInformationValues) => o.subsidiaryCompany === 'yes')
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @Matches(/[0-9,A-Za-z]*[$@!%*?#&_()~+,-/:;'\]"\\^`{|}<=>[\s]*/,
    { message: 'dashboard.kyc.validate.latinNumbersSpecialCharacters'},
  )
  companyStructure: string;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  totalTurnover: string;

  fiatToCryptoExchange: boolean = false;

  cryptoToFiatExchange: boolean = false;

  cryptoToCryptoExchange: boolean = false;

  other: boolean = false;

  @ValidateIf((o: CustomerInformationValues) => o.other)
  @IsNotEmpty({message: 'dashboard.fieldIsRequired'})
  otherDetails: string;
}

@injectable()
export class CustomerInformationStore extends BaseFormStore<CustomerInformationValues> {
  get type(): ClassType<CustomerInformationValues> {
    return CustomerInformationValues;
  }

  protected getInitialValues(): IValues<CustomerInformationValues> {
    return {};
  }

  @action
  async validate(): Promise<boolean> {
    let result = true;

    try {
      result = await super.validate();
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(e);
    }

    const validator = new Validator();

    this.values.fiatToCryptoExchange = !!this.values.fiatToCryptoExchange;
    this.values.cryptoToFiatExchange = !!this.values.cryptoToFiatExchange;
    this.values.cryptoToCryptoExchange = !!this.values.cryptoToCryptoExchange;
    this.values.other = !!this.values.other;

    const values =
      this.values.fiatToCryptoExchange ||
      this.values.cryptoToFiatExchange ||
      this.values.cryptoToCryptoExchange ||
      this.values.other;

    const isEmpty = validator.isEmpty(values);

    if (isEmpty) {
      this.errors.fiatToCryptoExchange = 'dashboard.fieldIsRequired';
      this.errors.cryptoToFiatExchange = 'dashboard.fieldIsRequired';
      this.errors.cryptoToCryptoExchange = 'dashboard.fieldIsRequired';
      this.errors.other = 'dashboard.fieldIsRequired';
      result = false;
    } else {
      this.errors.fiatToCryptoExchange = '';
      this.errors.cryptoToFiatExchange = '';
      this.errors.cryptoToCryptoExchange = '';
      this.errors.other = '';
    }

    return result;
  }

  // @action
  // loadLocalStorage() {
  //   const getCacheItem = (name: string) => window.localStorage.getItem(name);
  //   const getValue = (name: string) => (getCacheItem(name) || null);
  //
  //   this.values.companyName = getValue('companyName');
  //   this.values.companyActivity = getValue('companyActivity');
  //   this.values.companyEmail = getValue('companyEmail');
  //   this.values.companyStructure = getValue('companyStructure');
  //   this.values.contactPhone = getValue('contactPhone');
  //
  //   this.values.countryOfRegistration = getValue('countryOfRegistration');
  //   this.values.correspondenceAddress = getValue('correspondenceAddress');
  //
  //   this.values.other = !!getValue('other');
  //   this.values.otherDetails = getValue('otherDetails');
  //   this.values.cryptoToFiatExchange = !!getValue('cryptoToFiatExchange');
  //   this.values.cryptoToCryptoExchange = !!getValue('cryptoToCryptoExchange');
  //   this.values.fiatToCryptoExchange = !!getValue('fiatToCryptoExchange');
  //
  //   this.values.subsidiaryCompany = getValue('subsidiaryCompany');
  //   this.values.licenseOrRegistrationNumber = getValue('licenseOrRegistrationNumber');
  //   this.values.registeredOrLicensedActivity = getValue('registeredOrLicensedActivity');
  //   this.values.legalAddress = getValue('legalAddress');
  //   this.values.operationCountry = getValue('operationCountry');
  //   this.values.webPage = getValue('webPage');
  //   this.values.totalTurnover = getValue('totalTurnover');
  //   this.values.registrationNumber = getValue('registrationNumber');
  //   this.values.registrationDate = new Date(getCacheItem('registrationDate')) || new Date();
  //
  //   // const additionalOperationCountries = getValue('additionalOperationCountries');
  //   // const haveOperationCountries = additionalOperationCountries && additionalOperationCountries.split(',')[0] !== '';
  //   // this.values.additionalOperationCountries = haveOperationCountries
  //   //   ? getCacheItem('additionalOperationCountries').split(',')
  //   //   : [];
  // }
  //
  // @action
  // load() {
  //   console.log('propertyNames: ', this.getPropertyNames());
  //
  //   const getCacheItem = (name: string) => window.localStorage.getItem(name);
  //   const getValue = (name: string) => (getCacheItem(name) || null);
  //   const keys = Object.keys(new CustomerInformationValues());
  //   // console.log('additionalOperationCountries: ', typeof this.values.additionalOperationCountries);
  //   for (const key of keys) {
  //     // console.log('key: ', key);
  //     // console.log('this.values[key]: ', typeof this.values[key]);
  //     // console.log('this.values[key] instanceof Array: ', this.values[key] instanceof Array);
  //     if (this.values[key] instanceof Array) {
  //       const have = getValue(key) && getValue(key).split(',')[0] !== '';
  //       this.values[key] = have ? getCacheItem(key).split(',') : [];
  //     }
  //     else { this.values[key] = getValue(key); }
  //   }
  // }
}
