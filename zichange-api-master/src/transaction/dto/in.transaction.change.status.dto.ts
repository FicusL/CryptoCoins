import {IsEnum, IsOptional, MaxLength} from 'class-validator';
import {ApiModelProperty, ApiModelPropertyOptional} from '@nestjs/swagger';
import {TransactionStatus} from '../const/transaction.status.enum';

export class InTransactionChangeStatusDTO {
  @IsEnum(TransactionStatus)
  @ApiModelProperty({ enum: TransactionStatus})
  status: TransactionStatus;

  @MaxLength(512)
  @IsOptional()
  @ApiModelPropertyOptional()
  rejectReason: string | undefined;
}
