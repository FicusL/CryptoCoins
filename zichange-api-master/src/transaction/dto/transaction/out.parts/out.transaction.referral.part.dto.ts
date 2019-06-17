import { ApiModelProperty } from '@nestjs/swagger';
import { TransactionEntity } from '../../../entity/transaction.entity';

export class OutTransactionReferralPartDTO {
  @ApiModelProperty()
  referralId?: number;

  @ApiModelProperty()
  referralTransactionId?: number;

  @ApiModelProperty()
  currency: string;

  @ApiModelProperty()
  amount: string;

  constructor(entity: TransactionEntity) {
    this.referralId = entity.referralId;
    this.referralTransactionId = entity.referralTransactionId;
    this.currency = entity.referralData.currency;
    this.amount = entity.referralData.amount.toString();
  }
}