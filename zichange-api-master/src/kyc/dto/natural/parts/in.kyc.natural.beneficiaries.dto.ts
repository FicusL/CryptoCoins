import { IsAlpha, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

export class InKycNaturalBeneficiariesDto {
  // BeneficiariesRepresentatives
  @IsNotEmpty()
  representedByThirdParty: string;

  @ValidateIf(o => o.representedByThirdParty === 'yes')
  @IsNotEmpty({ message: 'First name is required' })
  @IsAlpha({ message: 'The field must contain only latin characters' })
  beneficFirstName3Party: string;

  @ValidateIf(o => o.representedByThirdParty === 'yes')
  @IsNotEmpty({ message: 'Last name is required' })
  @IsAlpha({ message: 'The field must contain only latin characters'})
  beneficLastName3Party: string;

  @ValidateIf(o => o.representedByThirdParty === 'yes')
  @IsNotEmpty({ message: 'Birth date is required' })
  beneficBirthDate3Party: Date;

  @ValidateIf(o => o.representedByThirdParty === 'yes')
  @IsNotEmpty({ message: 'Basis power attorney is required' })
  basisPowerAttorney: string;

  @ValidateIf(o => o.representedByThirdParty === 'yes')
  @IsNotEmpty({ message: 'Field power attorney is required' })
  fieldPowerAttorney: string;

  @ValidateIf(o => o.representedByThirdParty === 'yes')
  @IsNotEmpty({ message: 'Term power attorney is required' })
  termPowerAttorney: string;

  @IsNotEmpty()
  ultimateBeneficiary: string;

  @ValidateIf(o => o.ultimateBeneficiary === 'no')
  @IsNotEmpty({ message: 'First name is required' })
  @IsAlpha({ message: 'The field must contain only latin characters'})
  beneficFirstNameUltBeneficiary: string;

  @ValidateIf(o => o.ultimateBeneficiary === 'no')
  @IsNotEmpty({ message: 'Last name is required' })
  @IsAlpha({ message: 'The field must contain only latin characters'})
  beneficLastNameUltBeneficiary: string;

  @ValidateIf(o => o.ultimateBeneficiary === 'no')
  @IsOptional()
  personalCode: string;

  @ValidateIf(o => o.ultimateBeneficiary === 'no')
  @IsNotEmpty({ message: 'Birth date is required' })
  beneficBirthDateUltBeneficiary: Date;

  @ValidateIf(o => o.ultimateBeneficiary === 'no')
  @IsNotEmpty({ message: 'Place of birth is required' })
  beneficBirthPlace: string;

  @ValidateIf(o => o.ultimateBeneficiary === 'no')
  @IsNotEmpty({ message: 'Country of residence is required' })
  beneficResidenceCountry: string;

  @IsNotEmpty()
  PEP: string;

  @ValidateIf(o => o.PEP === 'yes')
  @IsNotEmpty({ message: 'Official name is required' })
  officialFullName: string;

  @ValidateIf(o => o.PEP === 'yes')
  @IsNotEmpty({ message: 'Position is required' })
  officialPosition: string;

  @ValidateIf(o => o.PEP === 'yes')
  @IsNotEmpty({ message: 'PEP relation is required' })
  politicallyExposedRelation: string;
}