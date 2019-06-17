import { Matches } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class InSettingsReferralDTO {
  @Matches(/^\d+\.?\d*$/)
  @ApiModelProperty()
  exchangeCommissionCoefficient: string;
}