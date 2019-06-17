import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class OutCryptoWalletDTO {
  @ApiModelPropertyOptional()
  id?: number;

  @ApiModelProperty()
  label: string;

  @ApiModelProperty()
  address: string;

  constructor(data: OutCryptoWalletDTO) {
    Object.assign(this, data);
  }
}