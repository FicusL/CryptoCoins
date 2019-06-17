import { IsString, MaxLength } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { IBankAccount } from '../../../../core/abstract/core.bank.account.interface';

export class InSettingsBankAccountDTO implements Partial<IBankAccount> {
  @MaxLength(512)
  @IsString()
  @ApiModelProperty()
  bankName: string;

  @MaxLength(512)
  @IsString()
  @ApiModelProperty()
  currency: string;

  @MaxLength(512)
  @IsString()
  @ApiModelProperty()
  BIC: string;

  @MaxLength(512)
  @IsString()
  @ApiModelProperty()
  IBAN: string;

  @MaxLength(512)
  @IsString()
  @ApiModelProperty()
  recipientName: string;
}