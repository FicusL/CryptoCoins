import { KycEntity } from '../entity/kyc.entity';
import { KycStatus } from '../const/kyc.status';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { AccountType } from '../../account/const/account.type.enum';
import { SumsubReviewStatuses } from '../sumsub/types/sumsub.review-statuses';
import { OutKycInfoFromSumsubDTO } from './out.kyc.info-from-sumsub.dto';

export class OutKycDto {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  accountId: number;

  @ApiModelProperty()
  accountEmail: string;

  @ApiModelProperty({ enum: AccountType })
  accountType: AccountType;

  @ApiModelProperty({ enum: KycStatus })
  status: KycStatus;

  @ApiModelProperty()
  rejectReason?: string;

  @ApiModelProperty()
  lastEditBy?: number;

  @ApiModelProperty()
  createDate: Date;

  @ApiModelProperty()
  lastEditDate: Date;

  @ApiModelPropertyOptional()
  sumSubDocumentNumber?: string;

  @ApiModelPropertyOptional()
  sumSubApplicantId?: string;

  @ApiModelPropertyOptional({ enum: SumsubReviewStatuses })
  sumSubStatus?: SumsubReviewStatuses;

  @ApiModelPropertyOptional({ type: OutKycInfoFromSumsubDTO })
  sumSubInfo?: OutKycInfoFromSumsubDTO;

  @ApiModelProperty()
  forbiddenSend: boolean;

  constructor(mainEntity: KycEntity, sumSubInfo?: OutKycInfoFromSumsubDTO) {
    this.id = mainEntity.id;

    if (mainEntity.account) {
      this.accountId = mainEntity.account.id;
      this.accountEmail = mainEntity.account.email;
      this.accountType = mainEntity.account.type;
    }

    this.status = mainEntity.status;
    this.rejectReason = mainEntity.rejectReason;

    this.lastEditBy = mainEntity.lastEditBy ? mainEntity.lastEditBy.id : undefined;
    this.createDate = mainEntity.createDate;
    this.lastEditDate = mainEntity.lastEditDate;

    this.sumSubDocumentNumber = mainEntity.sumSubDocumentNumber;
    this.sumSubApplicantId = mainEntity.sumSubApplicantId;
    this.sumSubStatus = mainEntity.sumSubStatus;

    this.sumSubInfo = sumSubInfo;
    this.forbiddenSend = mainEntity.forbiddenSend;
  }
}