import { IsDefined, ValidateNested } from 'class-validator';
import { InKycLegalBeneficiariesDataDto } from './parts/in.kyc.legal.beneficiaries.data.dto';
import { InKycLegalCustomerInfoDto } from './parts/in.kyc.legal.customer.info.dto';
import { InKycLegalMainPartnersDto } from './parts/in.kyc.legal.main.partners.dto';
import { InKycLegalManagementPersonalDto } from './parts/in.kyc.legal.management.personal.dto';
import { InKycLegalOtherInfoDto } from './parts/in.kyc.legal.other.info.dto';
import { InKycLegalRepresentativeDto } from './parts/in.kyc.legal.representative.dto';
import { Type } from 'class-transformer';

export class InKycLegalCreateDTO {
  @ValidateNested()
  @IsDefined()
  @Type(() => InKycLegalBeneficiariesDataDto)
  beneficiariesData: InKycLegalBeneficiariesDataDto;

  @ValidateNested()
  @IsDefined()
  @Type(() => InKycLegalCustomerInfoDto)
  customerInformation: InKycLegalCustomerInfoDto;

  @ValidateNested()
  @IsDefined()
  @Type(() => InKycLegalMainPartnersDto)
  mainPartners: InKycLegalMainPartnersDto;

  @ValidateNested()
  @IsDefined()
  @Type(() => InKycLegalManagementPersonalDto)
  managementPersonalData: InKycLegalManagementPersonalDto;

  @ValidateNested()
  @IsDefined()
  @Type(() => InKycLegalOtherInfoDto)
  otherInfo: InKycLegalOtherInfoDto;

  @ValidateNested()
  @IsDefined()
  @Type(() => InKycLegalRepresentativeDto)
  representativeData: InKycLegalRepresentativeDto;
}