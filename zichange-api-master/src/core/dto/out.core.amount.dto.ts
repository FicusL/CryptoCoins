import { ApiModelProperty } from '@nestjs/swagger';

export class OutCoreAmountDTO {
  @ApiModelProperty()
  amount: number;
}