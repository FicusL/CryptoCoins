import { IsNumber } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class InCounterpartyV1StatusTransactionDTO {
  @IsNumber()
  @ApiModelProperty()
  transaction_id: number;
}