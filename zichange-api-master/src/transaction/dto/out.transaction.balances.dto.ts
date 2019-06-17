import {ApiModelProperty} from '@nestjs/swagger';
import {OutCurrencyBalanceDTO} from './out.currency.balance.dto';

export class OutTransactionBalancesDTO {
  @ApiModelProperty({isArray: true, type: OutCurrencyBalanceDTO})
  balances: OutCurrencyBalanceDTO[];

  constructor(balances: OutCurrencyBalanceDTO[]) {
    this.balances = balances;
  }
}