import { ApiModelProperty } from '@nestjs/swagger';
import { IndexHistoryItemEntity } from '../entity/index.history-item.entity';

export class OutIndexHistoryItemDTO {
  @ApiModelProperty()
  timestamp: number;

  @ApiModelProperty()
  totalValueInEUR: string;

  @ApiModelProperty()
  supply: string;

  constructor(entity?: IndexHistoryItemEntity) {
    if (!entity) {
      return;
    }

    this.timestamp = entity.date.getTime();
    this.totalValueInEUR = entity.totalValueInEUR.toString();
    this.supply = entity.supply.toString();
  }
}