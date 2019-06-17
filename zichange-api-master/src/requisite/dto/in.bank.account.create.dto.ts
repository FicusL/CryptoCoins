import {ApiModelProperty} from '@nestjs/swagger';
import {IsNumber} from 'class-validator';
import {InBankAccountUpdateDTO} from './in.bank.account.update.dto';

export class InBankAccountCreateDTO extends InBankAccountUpdateDTO {
  @IsNumber()
  @ApiModelProperty()
  accountId: number;
}