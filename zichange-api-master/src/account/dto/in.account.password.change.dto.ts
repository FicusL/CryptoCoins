import { IsNotEmpty, IsNumberString, IsOptional, Length, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { accountPasswordPattern } from '../const/account.password-pattern';

export class InAccountChangePasswordDTO {
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(255)
  @Matches(accountPasswordPattern)
  @ApiModelProperty()
  oldPassword: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(255)
  @Matches(accountPasswordPattern)
  @ApiModelProperty()
  newPassword: string;

  @IsOptional()
  @Length(6)
  @IsNumberString()
  @ApiModelProperty()
  code: string;
}