import { CounterpartyTransactionStepsEnum } from '../const/counterparty.transaction-steps.enum';
import { ApiModelProperty } from '@nestjs/swagger';

export class OutCounterpartyCurrentStepDTO {
  @ApiModelProperty({ enum: CounterpartyTransactionStepsEnum })
  step: CounterpartyTransactionStepsEnum;
}