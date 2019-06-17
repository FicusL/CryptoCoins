import { ApiModelProperty } from '@nestjs/swagger';

export class OutTransactionsAmountDTO {
  @ApiModelProperty()
  amount: number;

  constructor(amount: number) {
    this.amount = amount;
  }
}