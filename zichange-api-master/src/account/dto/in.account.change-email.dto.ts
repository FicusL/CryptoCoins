import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class InAccountChangeEmailDTO {
  @ApiModelProperty()
  @IsEmail()
  newEmail: string;

  @ApiModelProperty()
  @IsString()
  code2fa: string;
}