import { ApiModelPropertyOptional } from '@nestjs/swagger';

export class OutCounterpartyUrlDTO {
  @ApiModelPropertyOptional()
  url?: string;
}