import { OutTransactionOperationDataPartDTO } from './out.transaction.operation.data.part.dto';
import { OutTransactionOperationFeePartDTO } from './out.transaction.operation.fee.part.dto';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { TransactionDepositEmbedded } from '../../../entity/embedded/transaction-parts/transaction.deposit.embedded';
import { OutTransactionDepositMethodDTO } from './out.transaction.deposit.method.dto';
import { OutTransactionZichangeRequisitesDTO } from './out.transaction.zichange.requisites.dto';

export class OutTransactionDepositPartDTO extends OutTransactionOperationDataPartDTO {
  @ApiModelProperty({ type: OutTransactionDepositMethodDTO })
  method: OutTransactionDepositMethodDTO;

  @ApiModelProperty({ type: OutTransactionZichangeRequisitesDTO })
  zichangeRequisites: OutTransactionZichangeRequisitesDTO;

  @ApiModelProperty()
  paid: boolean;

  @ApiModelProperty()
  externalEUREquivalent: string;

  @ApiModelProperty({ type: OutTransactionOperationFeePartDTO })
  fee: OutTransactionOperationFeePartDTO;

  @ApiModelPropertyOptional()
  btcBlockchainIndex?: number;

  @ApiModelPropertyOptional()
  ethTxHash?: string;

  @ApiModelPropertyOptional()
  zcnTxHash?: string;

  constructor(data: TransactionDepositEmbedded) {
    super(data);

    this.method = new OutTransactionDepositMethodDTO(data.method);
    this.zichangeRequisites = new OutTransactionZichangeRequisitesDTO(data.zichangeRequisites);
    this.paid = data.paid;
    this.externalEUREquivalent = data.externalEUREquivalent.toString();
    this.fee = new OutTransactionOperationFeePartDTO(data.fee);
    this.btcBlockchainIndex = data.btcBlockchainIndex;
    this.ethTxHash = data.ethTxHash;
    this.zcnTxHash = data.zcnTxHash;
  }
}