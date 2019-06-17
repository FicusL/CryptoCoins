import { IsBoolean, IsOptional } from 'class-validator';
import { ApiModelPropertyOptional } from '@nestjs/swagger';

export class InAccountChangeRoleDTO {
  @IsBoolean()
  @IsOptional()
  @ApiModelPropertyOptional()
  isAmlOfficer?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiModelPropertyOptional()
  isTrader?: boolean;
}