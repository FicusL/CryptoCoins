import {ApiModelProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsNumberString, Length, MaxLength, MinLength} from 'class-validator';

export class InAccount2FAToggleDTO {
  @IsNotEmpty()
  @Length(6)
  @IsNumberString()
  @ApiModelProperty()
  code: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(255)
  @ApiModelProperty()
  password: string;
}