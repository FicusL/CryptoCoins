import { IsNotEmpty, IsNumberString, Matches } from 'class-validator';
import { BaseFormStore, IValues } from '../../../../../../Shared/stores/Forms/BaseFormStore';
import { ClassType } from 'class-transformer/ClassTransformer';


export class PartnerValues implements IValues {
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @Matches(/[0-9,A-Za-z]*[$@!%*?#&_()~+,-/:;'\]"\\^`{|}<=>[\s]*/,
    { message: 'dashboard.kyc.validate.latinNumbersSpecialCharacters'},
  )
  name: string;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @Matches(/[0-9,A-Za-z]*[$@!%*?#&_()~+,-/:;'\]"\\^`{|}<=>[\s]*/,
    { message: 'dashboard.kyc.validate.latinNumbersSpecialCharacters'},
  )
  activity: string;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  @IsNumberString({ message: 'dashboard.kyc.validate.mustBeNumber' })
  regNumber: string;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  regCountry: string;
}

export class PartnerStore extends BaseFormStore<PartnerValues> {
  get type(): ClassType<PartnerValues> {
    return PartnerValues;
  }

  protected getInitialValues(): IValues<PartnerValues> {
    return {};
  }
}
