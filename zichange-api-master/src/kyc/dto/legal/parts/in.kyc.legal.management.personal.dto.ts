import { IsArray, ValidateNested } from 'class-validator';
import { InKycLegalNestedPersonDto } from './nested/in.kyc.legal.nested.person.dto';

export class InKycLegalManagementPersonalDto {
  @ValidateNested({ each: true })
  @IsArray()
  persons: InKycLegalNestedPersonDto[];
}