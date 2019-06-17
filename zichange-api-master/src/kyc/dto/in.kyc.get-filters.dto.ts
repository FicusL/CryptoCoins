import { IsArray, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { KycStatus } from '../const/kyc.status';
import { IKycGetFilters } from '../abstract/kyc.get-filters.interface';

export class InKycGetFiltersDTO implements IKycGetFilters {
  @IsOptional()
  @IsEnum(KycStatus, { each: true })
  @ApiModelPropertyOptional({ enum: KycStatus, isArray: true })
  @IsArray()
  statuses?: KycStatus[];

  @IsOptional()
  @IsNumber()
  @ApiModelPropertyOptional()
  amount?: number;

  @IsOptional()
  @IsNumber()
  @ApiModelPropertyOptional()
  offset?: number;
}