import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, ValidateIf } from 'class-validator';
import { kycLegalInputPattern } from '../../../const/kyc.legal-input-pattern';
import { KycTotalTurnover } from '../../../const/kyc.total-turnover.enum';

export class InKycLegalCustomerInfoDto {
  @IsNotEmpty({ message: 'Required' })
  @Matches(kycLegalInputPattern,
    { message: 'Filed must contain only latin characters and dashes'},
  )
  companyName: string;

  @IsNotEmpty({ message: 'Required' })
  registrationNumber: string;

  @IsNotEmpty({ message: 'Required' })
  registrationDate: string;

  @IsNotEmpty({ message: 'Required' })
  @Matches(kycLegalInputPattern,
    { message: 'Filed must contain only latin characters, numbers, commas and dashes'},
  )
  legalAddress: string;

  @IsNotEmpty({ message: 'Required' })
  contactPhone: string;

  @IsNotEmpty({ message: 'Required' })
  @IsEmail(undefined, { message: 'Invalid email' })
  companyEmail: string;

  @IsOptional()
  webPage: string | undefined;

  @IsNotEmpty({ message: 'Required' })
  @IsString()
  countryOfRegistration: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Required' })
  @Matches(/[0-9,A-Za-z]*[$@!%*?#&_()~+,-/:;'\]"\\^`{|}<=>[\s]*/,
    { message: 'Field must contain only latin characters, numbers and special characters' },
  )
  correspondenceAddress: string | undefined;

  @IsNotEmpty({ message: 'Required' })
  @IsEnum(KycTotalTurnover)
  totalTurnover: KycTotalTurnover;

  @IsBoolean()
  fiatToCryptoExchange: boolean;

  @IsBoolean()
  cryptoToFiatExchange: boolean;

  @IsBoolean()
  cryptoToCryptoExchange: boolean;

  @IsBoolean()
  other: boolean;

  @ValidateIf((o: InKycLegalCustomerInfoDto) => o.other)
  @IsNotEmpty({message: 'Required'})
  @IsString()
  otherDetails: string;

  @IsNotEmpty({ message: 'Required' })
  @Matches(kycLegalInputPattern,
    { message: 'Filed must contain only latin characters, dashes and commas'},
  )
  companyActivity: string;

  @IsNotEmpty({ message: 'Required' })
  operationCountry: string;

  @IsOptional()
  additionalOperationCountries: string[];

  @IsNotEmpty({ message: 'Required' })
  registeredOrLicensedActivity: string;

  @ValidateIf((o: InKycLegalCustomerInfoDto) => o.registeredOrLicensedActivity === 'yes')
  @IsNotEmpty({ message: 'Required' })
  @Matches(kycLegalInputPattern,
    { message: 'Filed must contain only latin characters, numbers, commas and dashes'},
  )
  licenseOrRegistrationNumber: string;

  @IsNotEmpty({ message: 'Required' })
  subsidiaryCompany: string;

  @ValidateIf((o: InKycLegalCustomerInfoDto) => o.subsidiaryCompany === 'yes')
  @IsNotEmpty({ message: 'Required' })
  @Matches(kycLegalInputPattern,
    { message: 'Filed must contain only latin characters, numbers, commas and dashes'},
  )
  companyStructure: string;
}