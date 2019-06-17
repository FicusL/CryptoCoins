import { ApiModelProperty } from '@nestjs/swagger';

export class OutTransactionExtendedBalancesItemDTO {
  @ApiModelProperty()
  currency: string;

  @ApiModelProperty()
  balance: string;

  @ApiModelProperty()
  exchangeEurRate: string;

  @ApiModelProperty()
  exchangePercentDelta: string;

  @ApiModelProperty()
  totalValue: string;

  @ApiModelProperty()
  averagePurchasePrice: string;

  @ApiModelProperty()
  unrealizedProfitLoss: string;
}