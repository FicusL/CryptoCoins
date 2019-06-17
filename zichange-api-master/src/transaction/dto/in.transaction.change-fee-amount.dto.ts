import { IsOptional, Matches } from 'class-validator';
import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { ITransactionChangeFee } from '../abstract/transaction.change-fee.interface';
import { BigNumber } from 'bignumber.js';

export class InTransactionChangeFeeAmountDTO {
  @IsOptional()
  @Matches(/^\d+\.?\d*$/)
  @ApiModelPropertyOptional()
  depositFeeAmount?: string;

  @IsOptional()
  @Matches(/^\d+\.?\d*$/)
  @ApiModelPropertyOptional()
  exchangeFeeAmount?: string;

  @IsOptional()
  @Matches(/^\d+\.?\d*$/)
  @ApiModelPropertyOptional()
  withdrawalFeeAmount?: string;

  static convertToInterface(dto: InTransactionChangeFeeAmountDTO): ITransactionChangeFee {
    const amountOrUndefined = (amount?: string) => amount ? new BigNumber(amount) : undefined;

    return {
      depositFeeAmount: amountOrUndefined(dto.depositFeeAmount),
      exchangeFeeAmount: amountOrUndefined(dto.exchangeFeeAmount),
      withdrawalFeeAmount: amountOrUndefined(dto.withdrawalFeeAmount),
    };
  }
}