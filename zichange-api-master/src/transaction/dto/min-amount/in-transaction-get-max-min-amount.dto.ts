import { TransactionPartType } from '../../../core/const/core.transaction-part-type.enum';
import { TransactionDepositMethodType } from '../../const/transaction.deposit-method.enum';
import { TransactionWithdrawalMethodType } from '../../const/transaction.withdrawal-method.enum';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class InTransactionGetMaxMinAmountDTO {
  @IsEnum(TransactionPartType)
  @ApiModelProperty()
  type: TransactionPartType;

  @IsString()
  @ApiModelProperty()
  currency: string;

  @IsOptional()
  @IsEnum(TransactionDepositMethodType)
  @ApiModelPropertyOptional()
  depositMethod?: TransactionDepositMethodType;

  @IsOptional()
  @IsEnum(TransactionWithdrawalMethodType)
  @ApiModelPropertyOptional()
  withdrawalMethod?: TransactionWithdrawalMethodType;
}