import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { IsEnum } from 'class-validator';
import { IsOptional } from 'class-validator';
import { TransactionWithdrawalMethodType } from '../const/transaction.withdrawal-method.enum';

export class InTransactionWithdrawalUpdateDTO {
  @IsEnum(TransactionWithdrawalMethodType)
  @ApiModelProperty({ enum: TransactionWithdrawalMethodType })
  methodType: TransactionWithdrawalMethodType;

  @IsNumber()
  @ApiModelProperty()
  methodId: number;

  @IsOptional()
  @ApiModelProperty()
  code?: string;
}