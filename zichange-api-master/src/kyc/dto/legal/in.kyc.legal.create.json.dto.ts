import { IsJSON, validate } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { InKycLegalCreateDTO } from './in.kyc.legal.create.dto';
import { BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { InKycLegalBeneficiariesDataDto } from './parts/in.kyc.legal.beneficiaries.data.dto';
import { InKycLegalCustomerInfoDto } from './parts/in.kyc.legal.customer.info.dto';
import { InKycLegalMainPartnersDto } from './parts/in.kyc.legal.main.partners.dto';
import { InKycLegalManagementPersonalDto } from './parts/in.kyc.legal.management.personal.dto';
import { InKycLegalOtherInfoDto } from './parts/in.kyc.legal.other.info.dto';
import { InKycLegalRepresentativeDto } from './parts/in.kyc.legal.representative.dto';

export class InKycLegalCreateJsonDTO {
  @IsJSON()
  @ApiModelProperty()
  beneficiariesData: string;

  @IsJSON()
  @ApiModelProperty()
  customerInformation: string;

  @IsJSON()
  @ApiModelProperty()
  mainPartners: string;

  @IsJSON()
  @ApiModelProperty()
  managementPersonalData: string;

  @IsJSON()
  @ApiModelProperty()
  otherInfo: string;

  @IsJSON()
  @ApiModelProperty()
  representativeData: string;

  static async parseDTO(dtoJSON: InKycLegalCreateJsonDTO): Promise<InKycLegalCreateDTO> {
    const dto = new InKycLegalCreateDTO();

    dto.beneficiariesData = plainToClass<InKycLegalBeneficiariesDataDto, object>(
      InKycLegalBeneficiariesDataDto,
      JSON.parse(dtoJSON.beneficiariesData),
    );
    dto.customerInformation = plainToClass<InKycLegalCustomerInfoDto, object>(
      InKycLegalCustomerInfoDto,
      JSON.parse(dtoJSON.customerInformation),
    );
    dto.mainPartners = plainToClass<InKycLegalMainPartnersDto, object>(
      InKycLegalMainPartnersDto,
      JSON.parse(dtoJSON.mainPartners),
    );
    dto.managementPersonalData = plainToClass<InKycLegalManagementPersonalDto, object>(
      InKycLegalManagementPersonalDto,
      JSON.parse(dtoJSON.managementPersonalData),
    );
    dto.otherInfo = plainToClass<InKycLegalOtherInfoDto, object>(
      InKycLegalOtherInfoDto,
      JSON.parse(dtoJSON.otherInfo),
    );
    dto.representativeData = plainToClass<InKycLegalRepresentativeDto, object>(
      InKycLegalRepresentativeDto,
      JSON.parse(dtoJSON.representativeData),
    );

    const dtoErrors = await validate(dto);
    if (dtoErrors.length) {
      throw new BadRequestException(dtoErrors);
    }

    return dto;
  }
}