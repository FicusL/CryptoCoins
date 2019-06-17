import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { KycStatus } from '../const/kyc.status';
import { IKycGetFilters } from '../abstract/kyc.get-filters.interface';

export class InKycGetAmountDTO implements IKycGetFilters {
  @IsOptional()
  @IsEnum(KycStatus, { each: true })
  @ApiModelPropertyOptional({ enum: KycStatus, isArray: true })
  @IsArray()
  statuses?: KycStatus[];
}