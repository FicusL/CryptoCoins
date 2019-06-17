import { IndexEntity } from '../entity/index.entity';
import { OutIndexCurrencyDTO } from './out.index-currency.dto';
import { ApiModelProperty } from '@nestjs/swagger';
import { BigNumber } from 'bignumber.js';
import { IndexCurrencyEntity } from '../entity/index-currency.entity';

export class OutIndexDTO {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  ticker: string;

  @ApiModelProperty()
  title: string;

  @ApiModelProperty()
  supply: string;

  @ApiModelProperty()
  priceInEur: string;

  @ApiModelProperty()
  totalValueInEur: string;

  @ApiModelProperty({ type: OutIndexCurrencyDTO, isArray: true })
  currencies: OutIndexCurrencyDTO[];

  constructor(
    entity: IndexEntity,
    data: { priceInEur: BigNumber, totalValueInEur: BigNumber },
    getDataForCurrency: (currency: IndexCurrencyEntity) => { priceInEUR: BigNumber, changePriceInEUR: BigNumber, weight: BigNumber },
  ) {
    this.id = entity.id;
    this.ticker = entity.ticker;
    this.title = entity.title;
    this.supply = entity.supply.toString();

    this.priceInEur = data.priceInEur.toString();
    this.totalValueInEur = data.totalValueInEur.toString();

    this.currencies = (entity.currencies || []).map(currency => new OutIndexCurrencyDTO(currency, getDataForCurrency(currency)));
  }
}