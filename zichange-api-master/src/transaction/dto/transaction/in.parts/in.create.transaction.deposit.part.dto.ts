import { IsEnum } from 'class-validator';
import { IsBoolean } from 'class-validator';
import { TransactionDepositMethodType } from '../../../const/transaction.deposit-method.enum';
import { ApiModelProperty } from '@nestjs/swagger';
import { InTransactionOperationDataDTO } from './in.transaction.operation.data.dto';
import { ITransactionCreateDepositEmbedded } from '../../../abstract/operations/transaction-parts/transaction.create.deposit-embedded.interface';
import { BigNumber } from 'bignumber.js';

export class InCreateTransactionDepositPartDTO extends InTransactionOperationDataDTO {
  @IsBoolean()
  @ApiModelProperty()
  isActive: boolean;

  @IsEnum(TransactionDepositMethodType)
  @ApiModelProperty({ enum: TransactionDepositMethodType })
  type: TransactionDepositMethodType;

  static toModel(dto: InCreateTransactionDepositPartDTO): ITransactionCreateDepositEmbedded | undefined {
    if (!dto || !dto.isActive) {
      return undefined;
    }

    return {
      paid: false,
      method: { type: dto.type },
      amount: new BigNumber(dto.amount || 0),
      currency: dto.currency,
    };
  }
}