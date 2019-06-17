import {ApiModelProperty} from '@nestjs/swagger';

export class InAccountActivationResendDTO {
  @ApiModelProperty()
  captcha: string;
}