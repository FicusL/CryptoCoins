import { CounterpartyApiKeyEntity } from '../entity/counterparty.api-key.entity';
import { ApiModelProperty } from '@nestjs/swagger';

export class OutCounterpartyApiKeyDTO {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  label: string;

  @ApiModelProperty()
  firstSymbolsOfPublicKey: string;

  constructor(entity: CounterpartyApiKeyEntity) {
    this.id = entity.id;
    this.label = entity.label;
    this.firstSymbolsOfPublicKey = entity.firstSymbolsOfPublicKey;
  }
}