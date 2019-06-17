import { FeeType } from '../../../../core/const/core.fee.type.enum';
import { OutTransactionOperationDataPartDTO } from './out.transaction.operation.data.part.dto';
import { ApiModelProperty } from '@nestjs/swagger';
import { TransactionOperationFeeEmbedded } from '../../../entity/embedded/transaction-parts/transaction-operation.fee.embedded';

export class OutTransactionOperationFeePartDTO extends OutTransactionOperationDataPartDTO {
  @ApiModelProperty()
  key: string;

  @ApiModelProperty({ enum: FeeType })
  type: FeeType;

  @ApiModelProperty()
  value: string;

  constructor(data: TransactionOperationFeeEmbedded) {
    super(data);

    this.key = data.key;
    this.type = data.type;
    this.value = data.value.toString();
  }
}