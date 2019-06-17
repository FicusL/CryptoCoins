import { IBankAccount } from '../../../../core/abstract/core.bank.account.interface';
import { ApiModelProperty } from '@nestjs/swagger';

export class OutSettingsBankAccountDTO implements IBankAccount {
  @ApiModelProperty()
  label: string;

  @ApiModelProperty()
  bankName: string;

  @ApiModelProperty()
  currency: string;

  @ApiModelProperty()
  IBAN: string;

  @ApiModelProperty()
  BIC: string;

  @ApiModelProperty()
  recipientName: string;

  constructor(data: IBankAccount) {
    Object.assign(this, data);
  }
}