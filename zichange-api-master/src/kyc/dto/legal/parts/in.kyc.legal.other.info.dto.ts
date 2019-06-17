import { Equals, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class InKycLegalOtherInfoDto {
  @IsNotEmpty({ message: 'Required' })
  internationalActivity: string;

  @IsNotEmpty({ message: 'Required' })
  workOffshore: string;

  @IsNotEmpty({ message: 'Required' })
  @IsString()
  incomeSource: string;

  @IsNotEmpty({ message: 'Required' })
  costs: string;

  @IsOptional()
  additionalInfo: string | undefined;

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

  @ValidateIf((o: InKycLegalOtherInfoDto) => o.internationalActivity === 'yes')
  @IsNotEmpty({ message: 'Required' })
  @IsString()
  descriptionInternationalActivity: string;

  @ValidateIf((o: InKycLegalOtherInfoDto) => o.workOffshore === 'yes')
  @IsNotEmpty({ message: 'Required' })
  @IsString()
  descriptionWorkOffshore: string;

  @ValidateIf((o: InKycLegalOtherInfoDto) => o.controlStructure === 'yes')
  @IsNotEmpty({ message: 'Required' })
  @IsString()
  descriptionControlStructure: string;

  @IsNotEmpty({ message: 'Required' })
  @IsString()
  controlStructure: string;
}