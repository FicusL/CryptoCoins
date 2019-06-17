import {IsEnum, IsOptional, MaxLength} from 'class-validator';
import {KycStatus} from '../const/kyc.status';
import {ApiModelProperty, ApiModelPropertyOptional} from '@nestjs/swagger';

export class InKycChangeStatusDto {
  @IsEnum(KycStatus)
  @ApiModelProperty({ enum: KycStatus})
  status: KycStatus;

  @MaxLength(512)
  @IsOptional()
  @ApiModelPropertyOptional()
  rejectReason: string | undefined;
}
