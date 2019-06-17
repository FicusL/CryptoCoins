import {ApiModelProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsNumberString, Length} from 'class-validator';

export class InAccount2FAAuthDTO {
  @IsNotEmpty()
  @Length(6)
  @IsNumberString()
  @ApiModelProperty()
  code: string;
}