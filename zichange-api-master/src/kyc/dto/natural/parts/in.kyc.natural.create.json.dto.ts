import { IsJSON, validate } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { InKycNaturalCreateDto } from '../in.kyc.natural.create.dto';
import { BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { InKycNaturalPersonalDto } from './in.kyc.natural.personal.dto';
import { InKycNaturalBeneficiariesDto } from './in.kyc.natural.beneficiaries.dto';

export class InKycNaturalCreateJsonDto {
  @IsJSON()
  @ApiModelProperty()
  personalInformation: string;

  @IsJSON()
  @ApiModelProperty()
  beneficiariesAndRepresentatives: string;

  static async parseDTO(dtoJSON: InKycNaturalCreateJsonDto): Promise<InKycNaturalCreateDto> {
    const dto = new InKycNaturalCreateDto();

    // person
    dto.personalInformation = plainToClass<InKycNaturalPersonalDto, object>(
      InKycNaturalPersonalDto,
      JSON.parse(dtoJSON.personalInformation),
    );
    dto.personalInformation.birthDate = new Date(dto.personalInformation.birthDate);

    // beneficiaries
    const beneficiaries = plainToClass<InKycNaturalBeneficiariesDto, object>(
      InKycNaturalBeneficiariesDto,
      JSON.parse(dtoJSON.beneficiariesAndRepresentatives),
    );
    if (beneficiaries.beneficBirthDate3Party) {
      beneficiaries.beneficBirthDate3Party = new Date(beneficiaries.beneficBirthDate3Party);
    }
    if (beneficiaries.beneficBirthDateUltBeneficiary) {
      beneficiaries.beneficBirthDateUltBeneficiary = new Date(beneficiaries.beneficBirthDateUltBeneficiary);
    }
    dto.beneficiariesAndRepresentatives = beneficiaries;

    const dtoErrors = await validate(dto);
    if (dtoErrors.length) {
      throw new BadRequestException(dtoErrors);
    }

    return dto;
  }
}