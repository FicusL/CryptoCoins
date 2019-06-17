import { CaptchaSystem } from '../../../const/core.captcha.system.enum';
import { ApiModelProperty } from '@nestjs/swagger';

export class OutCaptchaSystemDTO {
  @ApiModelProperty({ enum: CaptchaSystem })
  captchaSystem: CaptchaSystem;
}