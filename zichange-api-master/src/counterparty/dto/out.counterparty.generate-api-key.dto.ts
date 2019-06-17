import { CounterpartyApiKeyEntity } from '../entity/counterparty.api-key.entity';
import { ApiModelProperty } from '@nestjs/swagger';

export class OutCounterpartyGenerateApiKeyDTO {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  label: string;

  @ApiModelProperty()
  publicKey: string;

  @ApiModelProperty()
  secretKey: string;

  @ApiModelProperty()
  firstSymbolsOfPublicKey: string;

  constructor(entity: CounterpartyApiKeyEntity, publicKey: string) {
    this.id = entity.id;
    this.label = entity.label;
    this.publicKey = publicKey;
    this.secretKey = entity.secretKey;
    this.firstSymbolsOfPublicKey = entity.firstSymbolsOfPublicKey;
  }
}