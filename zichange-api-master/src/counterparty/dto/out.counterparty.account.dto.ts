import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { KycStatus } from '../../kyc/const/kyc.status';

export class OutCounterpartyAccountDTO {
  @ApiModelProperty()
  accountId: number;

  @ApiModelProperty()
  email: string;

  @ApiModelPropertyOptional({ enum: KycStatus })
  kycStatus?: KycStatus;

  @ApiModelProperty()
  limitBalance: string;

  @ApiModelProperty()
  transactionsAmount: string;

  @ApiModelProperty()
  feesAmount: string;

  @ApiModelPropertyOptional()
  firstName?: string;

  @ApiModelPropertyOptional()
  lastName?: string;

  @ApiModelProperty()
  registrationDate: string;
}