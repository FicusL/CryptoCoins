import { ApiModelProperty } from '@nestjs/swagger';
import { TransactionLastEditEmbedded } from '../../../entity/embedded/transaction.last-edit.embedded';

export class OutTransactionEditPartDTO {
  @ApiModelProperty()
  date: Date;

  @ApiModelProperty()
  accountId: number;

  constructor(data: TransactionLastEditEmbedded) {
    this.date = data.date;
    this.accountId = data.editAccountId;

    const account = data.editAccount as any;

    if (typeof account === 'number') {
      this.accountId = account;
    }
  }
}