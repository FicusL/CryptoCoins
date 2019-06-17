import { SumsubSupportedDocumentTypes } from '../sumsub/types/sumsub.supported-document-types';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { SumSubVerificationLabels } from '../sumsub/dto/in.sumsub.getting-applicant-status.dto';
import { SumsubDocSubType } from '../sumsub/const/sumsub.doc-sub-type';

export class OutKycLastSentDocumentsInfoItemDTO {
  @ApiModelProperty()
  mustSend: boolean;

  @ApiModelPropertyOptional()
  imageId?: number;

  @ApiModelPropertyOptional({ enum: SumSubVerificationLabels })
  reviewAnswer?: SumSubVerificationLabels;

  @ApiModelPropertyOptional()
  moderationComment?: string;

  @ApiModelPropertyOptional()
  clientComment?: string;

  @ApiModelPropertyOptional()
  idDocSubType?: SumsubDocSubType;
}

export class OutKycLastSentDocumentsInfoDTO {
  @ApiModelPropertyOptional({ enum: SumsubSupportedDocumentTypes })
  lastSentDocumentType?: SumsubSupportedDocumentTypes;

  @ApiModelProperty()
  inspectionId: string;

  @ApiModelProperty()
  documentIsDoubleSided: boolean;

  @ApiModelProperty({ type: OutKycLastSentDocumentsInfoItemDTO })
  selfie: OutKycLastSentDocumentsInfoItemDTO;

  @ApiModelProperty({ type: OutKycLastSentDocumentsInfoItemDTO })
  documentFront: OutKycLastSentDocumentsInfoItemDTO;

  @ApiModelProperty({ type: OutKycLastSentDocumentsInfoItemDTO })
  documentBack: OutKycLastSentDocumentsInfoItemDTO;
}