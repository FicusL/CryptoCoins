import { CounterpartyTransactionsStatuses } from '../../../types/counterparty.transactions-statuses.enum';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class OutCounterpartyV1StatusTransactionDTO {
  @ApiModelProperty({ enum: CounterpartyTransactionsStatuses })
  status: CounterpartyTransactionsStatuses;

  @ApiModelPropertyOptional()
  reason?: string;
}