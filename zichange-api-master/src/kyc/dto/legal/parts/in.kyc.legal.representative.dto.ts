import { IsAlpha, IsEmail, IsNotEmpty, IsNumberString, IsOptional, Matches, ValidateIf } from 'class-validator';
import { kycLegalInputPattern } from '../../../const/kyc.legal-input-pattern';

export class InKycLegalRepresentativeDto {
  @IsNotEmpty({ message: 'Required' })
  @IsAlpha({ message: 'Field must contain only latin characters' })
  firstName: string;

  @IsNotEmpty({ message: 'Required' })
  @IsAlpha({ message: 'Field must contain only latin characters' })
  lastName: string;

  @IsOptional()
  personalCode: string;

  @IsNotEmpty({ message: 'Required' })
  dateOfBirth: string;

  @IsNotEmpty({ message: 'Required' })
  country: string;

  @IsNotEmpty({ message: 'Required' })
  countryOfResidence: string;

  @IsNotEmpty({ message: 'Required' })
  @Matches(kycLegalInputPattern,
    { message: 'Filed must contain only latin characters, numbers, commas and dashes'},
  )
  addressOfResidence: string;

  @IsNotEmpty({ message: 'Required' })
  idType: string;

  @IsNotEmpty({ message: 'Required' })
  @IsNumberString({ message: 'Field must be a number' })
  idNumber: string;

  @IsNotEmpty({ message: 'Required' })
  issuingCountry: string;

  @IsNotEmpty({ message: 'Required' })
  issueDate: string;

  @IsNotEmpty({ message: 'Required' })
  expirationDate: string;

  @IsNotEmpty({ message: 'Required' })
  @Matches(kycLegalInputPattern,
    { message: 'Filed must contain only latin characters and dashes'},
  )
  position: string;

  @IsNotEmpty({ message: 'Required' })
  contactPhone: string;

  @IsNotEmpty({ message: 'Required' })
  @IsEmail(undefined, { message: 'Invalid email' })
  representativeEmail: string;

  @IsNotEmpty({ message: 'Required' })
  politicallyExposed: string;

  @ValidateIf((o: InKycLegalRepresentativeDto) => o.politicallyExposed === 'yes')
  @IsNotEmpty({ message: 'Required' })
  @Matches(kycLegalInputPattern,
    { message: 'Filed must contain only latin characters and dashes'},
  )
  politicallyExposedName: string;

  @ValidateIf((o: InKycLegalRepresentativeDto) => o.politicallyExposed === 'yes')
  @IsNotEmpty({ message: 'Required' })
  @Matches(kycLegalInputPattern,
    { message: 'Filed must contain only latin characters and dashes'},
  )
  politicallyExposedPosition: string;

  @ValidateIf((o: InKycLegalRepresentativeDto) => o.politicallyExposed === 'yes')
  @IsNotEmpty({ message: 'Required' })
  politicallyExposedRelation: string;
}
