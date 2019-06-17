import { CounterpartyTransactionsStatuses } from '../../../types/counterparty.transactions-statuses.enum';
import { ApiModelProperty } from '@nestjs/swagger';

export class OutCounterpartyV1TransactionHistoryDTO {
  @ApiModelProperty()
  pair_id: number;

  @ApiModelProperty()
  payment_amount: number;

  @ApiModelProperty()
  receipt_amount: number;

  @ApiModelProperty()
  fee: number;

  @ApiModelProperty()
  wallet: string;

  @ApiModelProperty()
  url: string;

  @ApiModelProperty()
  transaction_id: number;

  @ApiModelProperty({ enum: CounterpartyTransactionsStatuses })
  status: CounterpartyTransactionsStatuses;
}