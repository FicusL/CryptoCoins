import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class OutBankAccountDTO {
  @ApiModelPropertyOptional()
  id?: number;

  @ApiModelProperty()
  label: string;

  @ApiModelProperty()
  bankName: string;

  @ApiModelProperty()
  currency: string;

  @ApiModelProperty()
  IBAN: string;

  @ApiModelProperty()
  BIC: string;

  @ApiModelProperty()
  recipientName: string;

  constructor(data: OutBankAccountDTO) {
    Object.assign(this, data);
  }
}