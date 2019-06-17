import { ApiModelProperty } from '@nestjs/swagger';

export class OutCounterpartyEmailDTO {
  @ApiModelProperty()
  email: string;
}