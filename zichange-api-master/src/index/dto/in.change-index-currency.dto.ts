import { Matches } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class InChangeIndexCurrencyDTO {
  @ApiModelProperty()
  @Matches(/^\d+\.?\d*$/)
  balance: string;
}