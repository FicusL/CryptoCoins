import { IsAlpha, IsDate, IsNotEmpty, IsOptional, Matches, MaxDate, MinDate, ValidateIf } from 'class-validator';
import { BaseFormStore, IValues } from '../../../../../../Shared/stores/Forms/BaseFormStore';
import { ClassType } from 'class-transformer/ClassTransformer';
import moment from 'moment';
import { action } from 'mobx';
import { injectable } from 'inversify';

export class PersonValues implements IValues {
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @IsAlpha({ message: 'dashboard.kyc.validate.onlyLatin' })
  firstName: string;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @IsAlpha({ message: 'dashboard.kyc.validate.onlyLatin' })
  lastName: string;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @MinDate(moment().subtract(150, 'years').toDate(), { message: 'dashboard.kyc.validate.invalidDate' })
  @MaxDate(moment().subtract(18, 'years').toDate(), { message: 'dashboard.kyc.validate.mustBeAtLeastEighteenYearsOld' })
  @IsDate({ message: 'dashboard.kyc.validate.invalidDate' })
  birthDate: Date;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  country: string;

  @IsOptional()
  personalCode: string;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  residenceCountry: string;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  politicallyExposed: string;

  @ValidateIf((o: PersonValues) => o.politicallyExposed === 'yes')
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @Matches(/[0-9,A-Za-z]*[$@!%*?#&_()~+,-/:;'\]"\\^`{|}<=>[\s]*/,
    { message: 'dashboard.kyc.validate.latinNumbersSpecialCharacters'},
  )
  politicallyExposedName: string;

  @ValidateIf((o: PersonValues) => o.politicallyExposed === 'yes')
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @Matches(/[0-9,A-Za-z]*[$@!%*?#&_()~+,-/:;'\]"\\^`{|}<=>[\s]*/,
    { message: 'dashboard.kyc.validate.latinNumbersSpecialCharacters'},
  )
  politicallyExposedPosition: string;

  @ValidateIf((o: PersonValues) => o.politicallyExposed === 'yes')
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  politicallyExposedRelation: string;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @Matches(/[0-9,A-Za-z]*[$@!%*?#&_()~+,-/:;'\]"\\^`{|}<=>[\s]*/,
    { message: 'dashboard.kyc.validate.latinNumbersSpecialCharacters'},
  )
  addressOfResidence: string;
}

@injectable()
export class PersonStore extends BaseFormStore<PersonValues> {
  get type(): ClassType<PersonValues> {
    return PersonValues;
  }

  protected getInitialValues(): IValues<PersonValues> {
    return {};
  }

  // @action
  // loadLocalStorage() {
  //
  //
  //   this.values.firstName = getValue('firstName');
  //   this.values.lastName = getValue('lastName');
  //   this.values.politicallyExposedRelation = getValue('politicallyExposedRelation');
  //   this.values.politicallyExposedPosition = getValue('politicallyExposedPosition');
  //   this.values.politicallyExposedName = getValue('politicallyExposedName');
  //   this.values.politicallyExposed = getValue('politicallyExposed');
  //   this.values.personalCode = getValue('personalCode');
  //   this.values.country = getValue('country');
  //   this.values.addressOfResidence = getValue('addressOfResidence');
  //   this.values.residenceCountry = getValue('residenceCountry');
  //   this.values.birthDate = new Date(getValue('birthDate')) || new Date();
  // }

  // @action
  // load() {
  //   const getCacheItem = (name: string) => window.localStorage.getItem(name);
  //   const getValue = (name: string) => (getCacheItem(name) || null);
  //
  //   const values = Object.keys(new PersonValues());
  //   console.log('load - values: ', values);
  //   for (const value of values) {
  //     this.values[value] = getValue(value);
  //   }
  // }
}
