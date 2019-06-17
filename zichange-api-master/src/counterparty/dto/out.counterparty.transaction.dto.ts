import { ApiModelProperty } from '@nestjs/swagger';

export class OutCounterpartyTransactionDTO {
  @ApiModelProperty()
  transactionId: number;

  @ApiModelProperty()
  wallet: string;

  @ApiModelProperty()
  fee: number;

  // TODO: delete later: deprecated
  @ApiModelProperty()
  amount: number;

  @ApiModelProperty()
  paymentAmount: string;

  @ApiModelProperty()
  receiptAmount: string;

  @ApiModelProperty()
  email: string;

  @ApiModelProperty()
  pairId: number;

  @ApiModelProperty()
  currencySell: string;

  @ApiModelProperty()
  currencyBuy: string;
}