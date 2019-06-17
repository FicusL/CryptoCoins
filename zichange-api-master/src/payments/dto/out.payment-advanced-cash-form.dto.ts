import { ApiModelProperty } from '@nestjs/swagger';

export class OutPaymentAdvancedCashFormDTO {
  @ApiModelProperty()
  ac_sign: string;

  @ApiModelProperty()
  ac_account_email: string;

  @ApiModelProperty()
  ac_sci_name: string;

  @ApiModelProperty()
  ac_amount: string;

  @ApiModelProperty()
  ac_currency: string;

  @ApiModelProperty()
  ac_order_id: string;

  @ApiModelProperty()
  ac_ps: string;

  @ApiModelProperty()
  ac_comments: string;
}