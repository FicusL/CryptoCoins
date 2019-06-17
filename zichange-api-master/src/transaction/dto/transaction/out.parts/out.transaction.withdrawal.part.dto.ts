import { OutTransactionOperationDataPartDTO } from './out.transaction.operation.data.part.dto';
import { OutTransactionOperationFeePartDTO } from './out.transaction.operation.fee.part.dto';
import { ApiModelProperty } from '@nestjs/swagger';
import { TransactionWithdrawalEmbedded } from '../../../entity/embedded/transaction-parts/transaction.withdrawal.embedded';
import { OutTransactionWithdrawalMethodDTO } from './out.transaction.withdrawal.method.dto';

export class OutTransactionWithdrawalPartDTO extends OutTransactionOperationDataPartDTO {
  @ApiModelProperty({ type: OutTransactionWithdrawalMethodDTO })
  method: OutTransactionWithdrawalMethodDTO;

  @ApiModelProperty()
  externalEUREquivalent: string;

  @ApiModelProperty({ type: OutTransactionOperationFeePartDTO })
  fee: OutTransactionOperationFeePartDTO;

  constructor(data: TransactionWithdrawalEmbedded) {
    super(data);

    this.method = new OutTransactionWithdrawalMethodDTO(data.method);
    this.externalEUREquivalent = data.externalEUREquivalent.toString();
    this.fee = new OutTransactionOperationFeePartDTO(data.fee);
  }
}