import { MaxLength } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class InCounterpartyGenerateApiKeyDTO {
  @MaxLength(64)
  @ApiModelProperty()
  label: string;
}