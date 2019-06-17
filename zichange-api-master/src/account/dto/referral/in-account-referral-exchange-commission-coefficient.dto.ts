import { Matches } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class InAccountReferralExchangeCommissionCoefficientDTO {
  @Matches(/^\d+\.?\d*$/)
  @ApiModelProperty()
  exchangeCommissionCoefficient: string;
}