import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { accountPasswordPattern } from '../const/account.password-pattern';

export class InAccountPasswordResetFinishDTO {
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(255)
  @Matches(accountPasswordPattern)
  @ApiModelProperty()
  password: string;
}