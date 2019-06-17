import {IsBoolean, IsDefined} from 'class-validator';
import { ValidateNested } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { InTransactionOperationDataDTO } from './in.transaction.operation.data.dto';
import { ITransactionCreateExchangeEmbedded } from '../../../abstract/operations/transaction-parts/transaction.create.exchange-embedded.interface';
import { ITransactionCreateOperationDataEmbeddedFull } from '../../../abstract/operations/transaction-parts/transaction.create.operation-data-embedded.interface';
import { ITransactionCreateOperationDataEmbeddedCurrency } from '../../../abstract/operations/transaction-parts/transaction.create.operation-data-embedded.interface';
import {Type} from 'class-transformer';

export class InCreateTransactionExchangePartDTO {
  @IsBoolean()
  @ApiModelProperty()
  isActive: boolean;

  @ApiModelProperty()
  @ValidateNested()
  @IsDefined()
  @Type(() => InTransactionOperationDataDTO)
  from: InTransactionOperationDataDTO;

  @ApiModelProperty()
  @ValidateNested()
  @IsDefined()
  @Type(() => InTransactionOperationDataDTO)
  to: InTransactionOperationDataDTO;

  static toModel(dto: InCreateTransactionExchangePartDTO): ITransactionCreateExchangeEmbedded | undefined {
    if (!dto || !dto.isActive) {
      return undefined;
    }

    return {
      from: InTransactionOperationDataDTO.toModel(dto.from) as ITransactionCreateOperationDataEmbeddedFull,
      to: InTransactionOperationDataDTO.toModel(dto.to) as ITransactionCreateOperationDataEmbeddedCurrency,
    };
  }
}