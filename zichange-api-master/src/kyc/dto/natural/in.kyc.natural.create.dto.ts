import { IsDefined, ValidateNested } from 'class-validator';
import { InKycNaturalPersonalDto } from './parts/in.kyc.natural.personal.dto';
import { InKycNaturalBeneficiariesDto } from './parts/in.kyc.natural.beneficiaries.dto';
import { Type } from 'class-transformer';

export class InKycNaturalCreateDto {
  @ValidateNested()
  @IsDefined()
  @Type(() => InKycNaturalPersonalDto)
  personalInformation: InKycNaturalPersonalDto;

  @ValidateNested()
  @IsDefined()
  @Type(() => InKycNaturalBeneficiariesDto)
  beneficiariesAndRepresentatives: InKycNaturalBeneficiariesDto;
}