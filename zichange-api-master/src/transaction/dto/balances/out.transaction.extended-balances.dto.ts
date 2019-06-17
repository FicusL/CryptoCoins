import { ApiModelProperty } from '@nestjs/swagger';
import { OutTransactionExtendedBalancesItemDTO } from './out.transaction.extended-balances-item.dto';

export class OutTransactionExtendedBalancesDTO {
  @ApiModelProperty({ type: OutTransactionExtendedBalancesItemDTO, isArray: true })
  balances: OutTransactionExtendedBalancesItemDTO[]; // crypto && fiat

  @ApiModelProperty({ type: OutTransactionExtendedBalancesItemDTO, isArray: true })
  crypto: OutTransactionExtendedBalancesItemDTO[];

  @ApiModelProperty({ type: OutTransactionExtendedBalancesItemDTO, isArray: true })
  fiat: OutTransactionExtendedBalancesItemDTO[];

  @ApiModelProperty({ type: OutTransactionExtendedBalancesItemDTO, isArray: true })
  basket: OutTransactionExtendedBalancesItemDTO[];

  @ApiModelProperty()
  totalValue: string;

  @ApiModelProperty()
  currency: string;
}