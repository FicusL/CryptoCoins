import {IsString, Matches, MaxLength} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';

export class InSettingsMinAmountsDTO {
  @MaxLength(32)
  @IsString()
  @ApiModelProperty()
  currency: string;

  @MaxLength(32)
  @Matches(/^\d+\.?\d*$/)
  @ApiModelProperty()
  amount: string;
}
