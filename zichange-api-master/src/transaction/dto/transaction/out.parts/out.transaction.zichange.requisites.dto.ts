import { ITransactionZichangeRequisites } from '../../../abstract/transaction.zichange-requisites.interface';
import { TransactionDepositMethodType } from '../../../const/transaction.deposit-method.enum';
import { ApiModelProperty } from '@nestjs/swagger';

export class OutTransactionZichangeRequisitesDTO {
  @ApiModelProperty({ enum: TransactionDepositMethodType })
  type: TransactionDepositMethodType;

  @ApiModelProperty()
  data: any;

  constructor(data: ITransactionZichangeRequisites) {
    this.type = data.type;
    this.data = data.data;
  }
}