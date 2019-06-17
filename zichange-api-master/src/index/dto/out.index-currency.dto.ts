import { IndexCurrencyEntity } from '../entity/index-currency.entity';
import { ApiModelProperty } from '@nestjs/swagger';
import { BigNumber } from 'bignumber.js';

export class OutIndexCurrencyDTO {
  @ApiModelProperty()
  currency: string;

  @ApiModelProperty()
  balance: string;

  @ApiModelProperty()
  priceInEUR: string;

  @ApiModelProperty()
  changePriceInEUR: string;

  @ApiModelProperty()
  valueInEUR: string;

  @ApiModelProperty()
  weight: string;

  constructor(entity: IndexCurrencyEntity, data: { priceInEUR: BigNumber, changePriceInEUR: BigNumber, weight: BigNumber }) {
    this.currency = entity.currency;
    this.balance = entity.balance.toString();
    this.priceInEUR = data.priceInEUR.toString();
    this.changePriceInEUR = data.changePriceInEUR.toString();
    this.valueInEUR = data.priceInEUR.multipliedBy(entity.balance).toString();
    this.weight = data.weight.toString();
  }
}