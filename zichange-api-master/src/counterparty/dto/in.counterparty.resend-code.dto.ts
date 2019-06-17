import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class InCounterpartyResendCodeDTO {
  @IsString()
  @ApiModelProperty()
  captcha: string;
}