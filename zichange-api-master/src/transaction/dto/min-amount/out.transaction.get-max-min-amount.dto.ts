import { ApiModelProperty } from '@nestjs/swagger';
import { BigNumber } from 'bignumber.js';

export class OutTransactionGetMaxMinAmountDTO {
  @ApiModelProperty()
  maxAmount: string;

  @ApiModelProperty()
  minAmount: string;

  constructor(data: { maxAmount: BigNumber, minAmount: BigNumber }) {
    this.maxAmount = data.maxAmount.toString();
    this.minAmount = data.minAmount.toString();
  }
}