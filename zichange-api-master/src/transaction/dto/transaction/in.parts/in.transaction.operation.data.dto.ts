import { IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';
import { Matches } from 'class-validator';
import { IsOptional } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { ITransactionCreateOperationDataEmbeddedFull } from '../../../abstract/operations/transaction-parts/transaction.create.operation-data-embedded.interface';
import { ITransactionCreateOperationDataEmbeddedCurrency } from '../../../abstract/operations/transaction-parts/transaction.create.operation-data-embedded.interface';
import { BigNumber } from 'bignumber.js';

export class InTransactionOperationDataDTO {
  @IsString()
  @IsNotEmpty()
  @ApiModelProperty()
  currency: string;

  @IsOptional()
  @Matches(/^\d+\.?\d*$/)
  @ApiModelProperty()
  amount?: string;

  static toModel(dto: InTransactionOperationDataDTO):
    ITransactionCreateOperationDataEmbeddedFull | ITransactionCreateOperationDataEmbeddedCurrency | undefined
  {
    if (dto.amount) {
      return {
        amount: new BigNumber(dto.amount),
        currency: dto.currency,
      };
    }

    return {
      currency: dto.currency,
    };
  }
}