import { ApiModelProperty } from '@nestjs/swagger';

export class OutPaymentPayeerFormDTO {
  @ApiModelProperty()
  m_shop: string;

  @ApiModelProperty()
  m_orderid: string;

  @ApiModelProperty()
  m_amount: string;

  @ApiModelProperty()
  m_curr: string;

  @ApiModelProperty()
  m_desc: string;

  @ApiModelProperty()
  m_sign: string;
}