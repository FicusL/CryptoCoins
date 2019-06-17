import {ApiModelProperty} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, Matches, MaxLength, MinLength} from 'class-validator';

export class InAccountDTO {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  @ApiModelProperty()
  email: string;

  @IsNotEmpty()
  @ApiModelProperty()
  password: string;

  @ApiModelProperty()
  captcha: string;
}