import { CounterpartyEntity } from '../entity/counterparty.entity';
import { ApiModelProperty } from '@nestjs/swagger';

export class OutCounterpartyWhiteListIpDTO {
  @ApiModelProperty()
  whiteListIPs: string[];

  @ApiModelProperty()
  useWhiteListIPs: boolean;

  constructor(entity: CounterpartyEntity) {
    this.whiteListIPs = entity.whiteListIPs;
    this.useWhiteListIPs = entity.useWhiteListIPs;
  }
}