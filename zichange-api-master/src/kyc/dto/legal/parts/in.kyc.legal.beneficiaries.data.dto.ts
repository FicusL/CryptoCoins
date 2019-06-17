import { InKycLegalNestedPersonDto } from './nested/in.kyc.legal.nested.person.dto';
import { IsArray, ValidateNested } from 'class-validator';

export class InKycLegalBeneficiariesDataDto {
  @ValidateNested({ each: true })
  @IsArray()
  persons: InKycLegalNestedPersonDto[];
}