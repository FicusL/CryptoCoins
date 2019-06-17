import { IsNumber } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class InCounterpartyV1GetPriceDTO {
  @IsNumber()
  @ApiModelProperty()
  pair_id: number;
}