import {IsDefined, IsNumber, ValidateNested} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';
import {InGetTransactionsSortDTO} from './in.get-transactions-sort.dto';
import {Type} from 'class-transformer';

export class InGetTransactionsDTO {
  @IsNumber()
  @ApiModelProperty()
  amount: number;

  @ValidateNested()
  @ApiModelProperty()
  @IsDefined()
  @Type(() => InGetTransactionsSortDTO)
  sort: InGetTransactionsSortDTO;
}