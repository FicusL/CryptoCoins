import { OutTransactionOperationDataPartDTO } from './out.transaction.operation.data.part.dto';
import { OutTransactionOperationFeePartDTO } from './out.transaction.operation.fee.part.dto';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { TransactionExchangeEmbedded } from '../../../entity/embedded/transaction-parts/transaction.exchange.embedded';
import { BigNumber } from 'bignumber.js';

export class OutTransactionExchangePartDTO {
  @ApiModelProperty({type: OutTransactionOperationDataPartDTO })
  from: OutTransactionOperationDataPartDTO;

  @ApiModelProperty({type: OutTransactionOperationDataPartDTO })
  to: OutTransactionOperationDataPartDTO;

  @ApiModelProperty({type: OutTransactionOperationFeePartDTO })
  fee: OutTransactionOperationFeePartDTO;

  @ApiModelPropertyOptional()
  rate?: string;

  @ApiModelPropertyOptional()
  reverseRate?: string;

  constructor(data: TransactionExchangeEmbedded) {
    this.from = new OutTransactionOperationDataPartDTO(data.from);
    this.to = new OutTransactionOperationDataPartDTO(data.to);
    this.fee = new OutTransactionOperationFeePartDTO(data.fee);
    this.rate = data.rate ? data.rate.toString() : undefined;
    this.reverseRate = data.rate ? (new BigNumber('1')).dividedBy(data.rate).toString() : undefined;
  }
}
