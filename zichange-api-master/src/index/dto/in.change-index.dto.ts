import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class InChangeIndexDTO {
  @ApiModelPropertyOptional()
  @IsOptional()
  @Matches(/^\d+\.?\d*$/)
  supply?: string;

  @ApiModelPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;
}