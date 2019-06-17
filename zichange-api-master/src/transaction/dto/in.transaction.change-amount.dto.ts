import { IsOptional, Matches } from 'class-validator';
import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { ITransactionChangeAmount } from '../abstract/transaction.change-amount.interface';
import { BigNumber } from 'bignumber.js';

export class InTransactionChangeAmountDTO {
  @IsOptional()
  @Matches(/^\d+\.?\d*$/)
  @ApiModelPropertyOptional()
  depositFromAmount: string;

  @IsOptional()
  @Matches(/^\d+\.?\d*$/)
  @ApiModelPropertyOptional()
  exchangeFromAmount: string;

  @IsOptional()
  @Matches(/^\d+\.?\d*$/)
  @ApiModelPropertyOptional()
  exchangeToAmount: string;

  @IsOptional()
  @Matches(/^\d+\.?\d*$/)
  @ApiModelPropertyOptional()
  withdrawalFromAmount: string;

  static ConvertToInterface(dto: InTransactionChangeAmountDTO): ITransactionChangeAmount {
    const amountOrUndefined = (amount?: string) => amount ? new BigNumber(amount) : undefined;

    return {
      depositFromAmount: amountOrUndefined(dto.depositFromAmount),
      exchangeFromAmount: amountOrUndefined(dto.exchangeFromAmount),
      exchangeToAmount: amountOrUndefined(dto.exchangeToAmount),
      withdrawalFromAmount: amountOrUndefined(dto.withdrawalFromAmount),
    };
  }
}