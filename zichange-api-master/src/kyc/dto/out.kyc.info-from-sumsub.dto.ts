import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { OutKycLastSentDocumentsInfoDTO } from './out.kyc.last-sent-documents-info.dto';

export class OutKycInfoFromSumsubDTO {
  @ApiModelProperty()
  data: object;

  @ApiModelProperty()
  status: object;

  @ApiModelPropertyOptional()
  clientReason?: string;

  @ApiModelPropertyOptional()
  amlReason?: string;

  @ApiModelProperty()
  lastSentDocumentsInfo: OutKycLastSentDocumentsInfoDTO;
}