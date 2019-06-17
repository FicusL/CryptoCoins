import { AccountType } from '../const/account.type.enum';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { InviteCodesService } from '../service/invite-codes.service';
import { accountPasswordPattern } from '../const/account.password-pattern';

export class InAccountRegisterDTO {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  @ApiModelProperty()
  email: string;

  @IsEnum(AccountType)
  @ApiModelProperty()
  type: AccountType;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(255)
  @Matches(accountPasswordPattern)
  @ApiModelProperty()
  password: string;

  @ValidateIf(() => InviteCodesService.IS_ENABLED)
  @IsNotEmpty()
  @ApiModelProperty()
  invite_code?: string;

  @IsOptional()
  @IsString()
  @ApiModelPropertyOptional()
  referralToken?: string;

  @ApiModelProperty()
  captcha: string;
}