import { ApiModelProperty } from '@nestjs/swagger';

export class OutCounterpartyBalanceFromFeesDTO {
  @ApiModelProperty()
  balanceFromFees: string;

  @ApiModelProperty()
  currency: string;
}