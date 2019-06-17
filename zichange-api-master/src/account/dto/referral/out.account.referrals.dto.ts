import {ApiModelProperty} from '@nestjs/swagger';

export class OutAccountReferralsDTO {
  @ApiModelProperty()
  referralsAmount: number;

  constructor(referralsAmount: number) {
    this.referralsAmount = referralsAmount;
  }
}