import { ApiModelProperty } from '@nestjs/swagger';
import { TransactionOperationDataEmbedded } from '../../../entity/embedded/transaction-parts/transaction-operation.data.embedded';

export class OutTransactionOperationDataPartDTO {
  @ApiModelProperty()
  currency: string;

  @ApiModelProperty()
  amount: string;

  constructor(data: TransactionOperationDataEmbedded) {
    this.currency = data.currency;
    this.amount = data.amount ? data.amount.toString() : '0';
  }
}