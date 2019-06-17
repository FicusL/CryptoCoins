import { IsNotEmpty, IsNumberString, Matches } from 'class-validator';
import { kycLegalInputPattern } from '../../../../const/kyc.legal-input-pattern';

export class InKycLegalNestedPartnerDto {
  @IsNotEmpty({ message: 'Required' })
  @Matches(kycLegalInputPattern,
    { message: 'Filed must contain only latin characters, dashes and commas'},
  )
  name: string;

  @IsNotEmpty({ message: 'Required' })
  @Matches(kycLegalInputPattern,
    { message: 'Filed must contain only latin characters, dashes and commas'},
  )
  activity: string;

  @IsNotEmpty({ message: 'Required' })
  @IsNumberString({ message: 'Field must be a number' })
  regNumber: string;

  @IsNotEmpty({ message: 'Required' })
  regCountry: string;
}