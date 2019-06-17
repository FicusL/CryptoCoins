import { ApiModelProperty } from '@nestjs/swagger';

export class InPaymentPayeerHandleDTO {
  @ApiModelProperty()
  m_operation_id: string;

  @ApiModelProperty()
  m_operation_ps: string;

  @ApiModelProperty()
  m_operation_date: string;

  @ApiModelProperty()
  m_operation_pay_date: string;

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
  m_status: string;

  @ApiModelProperty()
  m_sign: string;

  @ApiModelProperty()
  client_email: string;

  @ApiModelProperty()
  client_account: string;

  @ApiModelProperty()
  transfer_id: string;

  @ApiModelProperty()
  summa_out: string;

  @ApiModelProperty()
  m_params?: object;
}