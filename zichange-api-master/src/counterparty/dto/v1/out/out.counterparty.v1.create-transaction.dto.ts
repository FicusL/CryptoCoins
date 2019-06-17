import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { CounterpartyErrorCodes } from '../../../const/counterparty.error-codes.enum';

export class OutCounterpartyV1CreateTransactionDTO {
  @ApiModelProperty()
  url: string;

  @ApiModelProperty()
  transaction_id: number;

  @ApiModelPropertyOptional()
  error?: CounterpartyErrorCodes;
}