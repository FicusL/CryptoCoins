import { IsAlpha, IsNotEmpty, IsOptional, Matches, ValidateIf } from 'class-validator';
import { kycLegalInputPattern } from '../../../../const/kyc.legal-input-pattern';

export class InKycLegalNestedPersonDto {
  @IsNotEmpty({ message: 'Required' })
  @IsAlpha({ message: 'Field must contain only latin characters' })
  firstName: string;

  @IsNotEmpty({ message: 'Required' })
  @IsAlpha({ message: 'Field must contain only latin characters' })
  lastName: string;

  @IsNotEmpty({ message: 'Required' })
  birthDate: string;

  @IsNotEmpty({ message: 'Required' })
  country: string;

  @IsOptional()
  personalCode: string;

  @IsNotEmpty({ message: 'Required' })
  residenceCountry: string;

  @IsNotEmpty({ message: 'Required' })
  politicallyExposed: string;

  @ValidateIf((o: InKycLegalNestedPersonDto) => o.politicallyExposed === 'yes')
  @IsNotEmpty({ message: 'Required' })
  @Matches(kycLegalInputPattern,
    { message: 'Filed must contain only latin characters and dashes'},
  )
  politicallyExposedName: string;

  @ValidateIf((o: InKycLegalNestedPersonDto) => o.politicallyExposed === 'yes')
  @IsNotEmpty({ message: 'Required' })
  @Matches(kycLegalInputPattern,
    { message: 'Filed must contain only latin characters and dashes'},
  )
  politicallyExposedPosition: string;

  @ValidateIf((o: InKycLegalNestedPersonDto) => o.politicallyExposed === 'yes')
  @IsNotEmpty({ message: 'Required' })
  politicallyExposedRelation: string;

  @IsNotEmpty({ message: 'Required' })
  @Matches(/[0-9,A-Za-z]*[$@!%*?#&_()~+,-/:;'\]"\\^`{|}<=>[\s]*/, {
    message: 'Field must contain only latin characters, numbers and special characters' },
  )
  addressOfResidence: string;
}