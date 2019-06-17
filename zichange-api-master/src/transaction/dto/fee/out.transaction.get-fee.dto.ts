import { ApiModelProperty } from '@nestjs/swagger';
import { BigNumber } from 'bignumber.js';

export class OutTransactionGetFeeDTO {
  @ApiModelProperty()
  amount: string;

  constructor(amount: BigNumber) {
    this.amount = amount.toString();
  }
}