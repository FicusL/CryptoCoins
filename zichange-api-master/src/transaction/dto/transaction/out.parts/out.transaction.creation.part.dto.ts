import { ApiModelProperty } from '@nestjs/swagger';
import { TransactionCreationEmbedded } from '../../../entity/embedded/transaction.creation.embedded';

export class OutTransactionCreationPartDTO {
  @ApiModelProperty()
  date: Date;

  @ApiModelProperty()
  accountId: number;

  constructor(data: TransactionCreationEmbedded) {
    this.date = data.date;
    this.accountId = data.creationAccountId;

    const account = data.creationAccount as any;

    if (typeof account === 'number') {
      this.accountId = account;
    }
  }
}