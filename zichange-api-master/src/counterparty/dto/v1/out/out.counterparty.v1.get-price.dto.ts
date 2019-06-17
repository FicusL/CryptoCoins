import { ApiModelProperty } from '@nestjs/swagger';

export class OutCounterpartyV1GetPriceDTO {
  @ApiModelProperty()
  price: number;
}