import { ApiModelProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class InGeeTestCaptchaDTO {
  @ApiModelProperty()
  @IsString()
  geetest_challenge: string;

  @ApiModelProperty()
  @IsString()
  geetest_validate: string;

  @ApiModelProperty()
  @IsString()
  geetest_seccode: string;

  @ApiModelProperty()
  @IsBoolean()
  fallback: boolean;

  constructor(data: any) {
    if (!data) {
      return;
    }

    Object.assign(this, data);
  }
}