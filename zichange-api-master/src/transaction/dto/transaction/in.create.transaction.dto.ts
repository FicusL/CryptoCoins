import {IsDefined, IsEnum} from 'class-validator';
import { ValidateNested } from 'class-validator';
import { ValidateIf } from 'class-validator';
import { TransactionType } from '../../const/transaction.type.enum';
import { ApiModelProperty } from '@nestjs/swagger';
import { InCreateTransactionDepositPartDTO } from './in.parts/in.create.transaction.deposit.part.dto';
import { InCreateTransactionExchangePartDTO } from './in.parts/in.create.transaction.exchange.part.dto';
import { InCreateTransactionWithdrawalPartDTO } from './in.parts/in.create.transaction.withdrawal.part.dto';
import { TransactionEntity } from '../../entity/transaction.entity';
import { ITransactionCreate } from '../../abstract/operations/transaction.create.interface';
import {Type} from 'class-transformer';

export class InCreateTransactionDTO {
  @IsEnum(TransactionType)
  @ApiModelProperty({ enum: TransactionType })
  type: TransactionType;

  @ValidateIf((o: InCreateTransactionDTO) => TransactionEntity.DEPOSIT_AVAILABLE_TYPES.includes(o.type))
  @ValidateNested()
  @IsDefined()
  @Type(() => InCreateTransactionDepositPartDTO)
  @ApiModelProperty({ type: InCreateTransactionDepositPartDTO })
  deposit: InCreateTransactionDepositPartDTO;

  @ValidateIf((o: InCreateTransactionDTO) => TransactionEntity.EXCHANGE_AVAILABLE_TYPES.includes(o.type))
  @ValidateNested()
  @IsDefined()
  @Type(() => InCreateTransactionExchangePartDTO)
  @ApiModelProperty({ type: InCreateTransactionExchangePartDTO })
  exchange: InCreateTransactionExchangePartDTO;

  @ValidateIf((o: InCreateTransactionDTO) => TransactionEntity.WITHDRAWAL_AVAILABLE_TYPES.includes(o.type))
  @ValidateNested()
  @IsDefined()
  @Type(() => InCreateTransactionWithdrawalPartDTO)
  @ApiModelProperty({ type: InCreateTransactionWithdrawalPartDTO })
  withdrawal: InCreateTransactionWithdrawalPartDTO;

  @ValidateIf((o: InCreateTransactionDTO) => TransactionEntity.WITHDRAWAL_AVAILABLE_TYPES.includes(o.type))
  @ApiModelProperty()
  code2FA: string | undefined;

  static toModel(dto: InCreateTransactionDTO): ITransactionCreate {
    const result = {
      deposit: InCreateTransactionDepositPartDTO.toModel(dto.deposit),
      exchange: InCreateTransactionExchangePartDTO.toModel(dto.exchange),
      withdrawal: InCreateTransactionWithdrawalPartDTO.toModel(dto.withdrawal),

      type: dto.type,
      code2FA: dto.code2FA,
    };

    // Hotfix
    if (result.withdrawal) {
      result.withdrawal.code = dto.code2FA;
    }

    return result;
  }
}