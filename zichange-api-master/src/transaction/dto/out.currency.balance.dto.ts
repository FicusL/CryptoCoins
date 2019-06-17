import { ApiModelProperty } from '@nestjs/swagger';
import { BigNumber } from 'bignumber.js';

export class OutCurrencyBalanceDTO {
  @ApiModelProperty()
  currency: string;

  @ApiModelProperty()
  balance: string;

  static convertFromMap(mapBalance: Map<string, BigNumber>): OutCurrencyBalanceDTO[] {
    const result: OutCurrencyBalanceDTO[] = [];

    for (const [currency, balance] of mapBalance) {
      result.push({
        currency,
        balance: balance.toString(),
      });
    }

    return result;
  }
}
