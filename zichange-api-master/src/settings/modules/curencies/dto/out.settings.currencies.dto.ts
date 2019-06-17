import {ApiModelProperty} from '@nestjs/swagger';

export class OutSettingsCurrenciesDTO {
  @ApiModelProperty()
  currencies: string[];

  constructor(data: string[]) {
    this.currencies = data.map(el => el);
  }
}