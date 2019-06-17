import {IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';

export class InAccountPasswordResetDTO {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  @ApiModelProperty()
  email: string;

  @ApiModelProperty()
  captcha: string;
}