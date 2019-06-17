import { ApiModelProperty } from '@nestjs/swagger';

export class OutKycAmountDTO {
  @ApiModelProperty()
  amount: number;

  constructor(amount: number) {
    this.amount = amount;
  }
}