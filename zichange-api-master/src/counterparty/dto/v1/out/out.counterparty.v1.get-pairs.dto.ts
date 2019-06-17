import { ApiModelProperty } from '@nestjs/swagger';
import { CurrencyPairEntity } from '../../../../transaction/entity/currency-pair.entity';

export class OutCounterpartyV1GetPairsDTO {
  @ApiModelProperty()
  cur_in: string;

  @ApiModelProperty()
  cur_out: string;

  @ApiModelProperty()
  pair_id: number;

  @ApiModelProperty()
  active: boolean;

  constructor(entity: CurrencyPairEntity) {
    this.cur_in = entity.currencySell;
    this.cur_out = entity.currencyBuy;
    this.pair_id = entity.id;
    this.active = entity.active;
  }
}