import { ITransactionGetFilters } from '../abstract/transaction.get.filters.interface';
import { IsDate, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { TransactionStatus } from '../const/transaction.status.enum';
import { TransactionType } from '../const/transaction.type.enum';
import { Type } from 'class-transformer';
import { ApiModelPropertyOptional } from '@nestjs/swagger';

export class InTransactionsGetAmountDTO implements ITransactionGetFilters {
  @IsOptional()
  @IsEnum(TransactionStatus)
  @ApiModelPropertyOptional({ enum: TransactionStatus })
  status?: TransactionStatus;

  @IsOptional()
  @IsEnum(TransactionType)
  @ApiModelPropertyOptional({ enum: TransactionType })
  type?: TransactionType;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiModelPropertyOptional()
  beginDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiModelPropertyOptional()
  endDate?: Date;

  @IsOptional()
  @IsNumber()
  @ApiModelPropertyOptional()
  accountId?: number;
}