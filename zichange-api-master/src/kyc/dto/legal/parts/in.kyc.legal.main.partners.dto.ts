import { InKycLegalNestedPartnerDto } from './nested/in.kyc.legal.nested.partner.dto';
import { IsArray, ValidateNested } from 'class-validator';

export class InKycLegalMainPartnersDto {
  @ValidateNested({ each: true })
  @IsArray()
  partners: InKycLegalNestedPartnerDto[];
}
