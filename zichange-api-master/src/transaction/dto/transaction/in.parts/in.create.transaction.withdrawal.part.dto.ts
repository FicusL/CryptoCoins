import { InTransactionOperationDataDTO } from './in.transaction.operation.data.dto';
import { IsBoolean } from 'class-validator';
import { IsEnum } from 'class-validator';
import { IsNumber } from 'class-validator';
import { IsOptional } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { TransactionWithdrawalMethodType } from '../../../const/transaction.withdrawal-method.enum';
import { BigNumber } from 'bignumber.js';
import { ITransactionCreateWithdrawalEmbedded } from '../../../abstract/operations/transaction-parts/transaction.create.withdrawal-embedded.interface';

export class InCreateTransactionWithdrawalPartDTO extends InTransactionOperationDataDTO {
  @IsBoolean()
  @ApiModelProperty()
  isActive: boolean;

  @IsEnum(TransactionWithdrawalMethodType)
  @ApiModelProperty({ enum: TransactionWithdrawalMethodType })
  type: TransactionWithdrawalMethodType;

  @IsNumber()
  @ApiModelProperty()
  methodId: number;

  @IsOptional()
  @ApiModelProperty()
  code?: string;

  static toModel(dto: InCreateTransactionWithdrawalPartDTO): ITransactionCreateWithdrawalEmbedded | undefined {
    if (!dto || !dto.isActive) {
      return undefined;
    }

    return {
      method: { type: dto.type, id: dto.methodId },
      amount: new BigNumber(dto.amount || Infinity),
      currency: dto.currency,
      code: dto.code,
    };
  }
}