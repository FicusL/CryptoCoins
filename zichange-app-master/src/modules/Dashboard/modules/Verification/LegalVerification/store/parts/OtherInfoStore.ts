import { Equals, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { BaseFormStore, IValues } from '../../../../../../Shared/stores/Forms/BaseFormStore';
import { ClassType } from 'class-transformer/ClassTransformer';


export class OtherInfoValues implements IValues {

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  internationalActivity: string;

  @ValidateIf((o: OtherInfoValues) => o.internationalActivity === 'yes')
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  descriptionInternationalActivity: string;

  @ValidateIf((o: OtherInfoValues) => o.workOffshore === 'yes')
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  descriptionWorkOffshore: string;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  workOffshore: string;

  @ValidateIf((o: OtherInfoValues) => o.controlStructure === 'yes')
  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  descriptionControlStructure: string;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  controlStructure: string;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  incomeSource: string;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  costs: string;

  @IsOptional()
  additionalInfo: string;

  @Equals(true)
  confirm1: boolean;

  @Equals(true)
  confirm2: boolean;

  @Equals(true)
  confirm3: boolean;

  @Equals(true)
  confirm4: boolean;

  @Equals(true)
  confirm5: boolean;
}

export class OtherInfoStore extends BaseFormStore<OtherInfoValues> {
  get type(): ClassType<OtherInfoValues> {
    return OtherInfoValues;
  }


  protected getInitialValues(): IValues<OtherInfoValues> {
    return {

    };
  }
}
