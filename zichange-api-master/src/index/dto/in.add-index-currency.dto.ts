import { Matches } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class InAddIndexCurrencyDTO {
  @ApiModelProperty()
  @Matches(/^\d+\.?\d*$/)
  balance: string;
}