import { ApiModelProperty } from '@nestjs/swagger';

export class OutCounterpartyV1GetLimitDTO {
  @ApiModelProperty()
  currency: string;

  @ApiModelProperty()
  amount: number;
}