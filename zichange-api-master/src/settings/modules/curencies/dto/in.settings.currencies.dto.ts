import {ArrayUnique, IsString} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';

export class InSettingCurrenciesDTO {
  @ArrayUnique()
  @IsString({each: true})
  @ApiModelProperty()
  currencies: string[];
}