import { ApiModelProperty } from '@nestjs/swagger';

export class OutGeeTestCaptchaInitDTO {
  @ApiModelProperty()
  success: number;

  @ApiModelProperty()
  challenge: string;

  @ApiModelProperty()
  gt: string;

  @ApiModelProperty()
  new_captcha: boolean;

  @ApiModelProperty()
  fallback: boolean;
}