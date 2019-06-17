import { IsNumber, IsOptional } from 'class-validator';
import { ApiModelPropertyOptional } from '@nestjs/swagger';

export class InCounterpartyGetAccountsFilterDTO {
  @IsOptional()
  @IsNumber()
  @ApiModelPropertyOptional()
  amount?: number;

  @IsOptional()
  @IsNumber()
  @ApiModelPropertyOptional()
  offset?: number;
}