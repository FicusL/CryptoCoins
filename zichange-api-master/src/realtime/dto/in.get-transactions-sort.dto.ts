import {IsEnum} from 'class-validator';
import {TransactionSortBy} from '../const/transaction/transaction.sort.by.enum';
import {ApiModelProperty} from '@nestjs/swagger';
import {TransactionSortDirection} from '../const/transaction/transaction.sort.direction.enum';

export class InGetTransactionsSortDTO {
  @IsEnum(TransactionSortBy)
  @ApiModelProperty({ enum: TransactionSortBy})
  by: TransactionSortBy;

  @IsEnum(TransactionSortDirection)
  @ApiModelProperty({ enum: TransactionSortDirection})
  direction: TransactionSortDirection;
}
