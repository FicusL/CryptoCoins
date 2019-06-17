import { ITransactionDepositMethod } from '../../../abstract/transaction.deposit-method.interface';
import { TransactionDepositMethodType } from '../../../const/transaction.deposit-method.enum';
import { ApiModelProperty } from '@nestjs/swagger';

export class OutTransactionDepositMethodDTO {
  @ApiModelProperty({ enum: TransactionDepositMethodType })
  type: TransactionDepositMethodType;

  constructor(data: ITransactionDepositMethod) {
    this.type = data.type;
  }
}