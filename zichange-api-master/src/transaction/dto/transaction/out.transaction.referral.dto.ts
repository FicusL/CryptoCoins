import { TransactionEntity } from '../../entity/transaction.entity';
import { ApiModelProperty } from '@nestjs/swagger';

export class OutTransactionReferralDTO {
  @ApiModelProperty()
  date: Date;

  @ApiModelProperty()
  referralId: number;

  @ApiModelProperty()
  transactionAmount: string;

  @ApiModelProperty()
  serviceFee: string;

  @ApiModelProperty()
  amount: string;

  @ApiModelProperty()
  currency: string;

  constructor(entity: TransactionEntity) {
    this.date = entity.creation.date;
    this.referralId = entity.referralId || -1;

    const { currency, amount, serviceFee, transactionAmount} = entity.referralData;

    this.transactionAmount = transactionAmount.toString();
    this.serviceFee = serviceFee.toString();
    this.amount = amount.toString();
    this.currency = currency;
  }
}