import { SumsubApiBaseService } from './sumsub-api.base.service';
import { ISumsubAddingDocumentMetadata } from '../types/adding-document/sumsub.adding-document-metadata.interface';
import { InSumsubCreateApplicantDTO } from '../dto/in.sumsub.create-applicant.dto';
import { InSumsubAddingDocumentDTO } from '../dto/in.sumsub.adding-document.dto';
import { ISumsubCreateApplicantBody } from '../types/create-applicant/sumsub.create-applicant-body.interface';
import { InSumsubGettingApplicantStatusDTO, SumSubVerificationLabels } from '../dto/in.sumsub.getting-applicant-status.dto';
import { SumsubReviewStatuses } from '../types/sumsub.review-statuses';
import { Injectable } from '@nestjs/common';
import { InSumsubGetApplicantDataDTO } from '../dto/in.sumsub.get-applicant-data.dto';
import { SumsubSupportedDocumentTypes } from '../types/sumsub.supported-document-types';
import { ISumsubCreateApplicantInfo } from '../types/create-applicant/sumsub.create-applicant-info.interface';
import { IFileElement } from '../../../core/abstract/file.element.interface';
import { SumsubCreateApplicantDocTypes } from '../types/create-applicant/sumsub.create-applicant-doc.types';
import { ISumsubCreateApplicantRequiredDocs } from '../types/create-applicant/sumsub-create-applicant-required-docs.interface';

@Injectable()
export class SumsubApiMock extends SumsubApiBaseService {
  async addDocument(applicantId: string, metadata: ISumsubAddingDocumentMetadata, content: Buffer, fileExtension: string)
    : Promise<InSumsubAddingDocumentDTO> {
    return {
      idDocType: metadata.idDocType,
      country: metadata.country,
    };
  }

  async createApplicant(params: ISumsubCreateApplicantBody): Promise<InSumsubCreateApplicantDTO> {
    return {
      id: `id_${Date.now()}`,
      createdAt: `${Date.now()}`,
      clientId: `client_id_${Date.now()}`,
      inspectionId: `inspection_id_${Date.now()}`,
      jobId: `job_${Date.now()}`,
      info: { },
      env: `env_${Date.now()}`,
      review: {
        createDate: `${Date.now()}`,
        reviewStatus: SumsubReviewStatuses.init,
        notificationFailureCnt: Date.now(),
      },
    };
  }

  async changeApplicantData(applicantId: string, info: ISumsubCreateApplicantInfo, oldInfo: ISumsubCreateApplicantInfo | undefined): Promise<void> {
    // nothing
  }

  async changeRequiredDocumentSet(applicantId: string, docSet: ISumsubCreateApplicantRequiredDocs): Promise<ISumsubCreateApplicantRequiredDocs> {
    return docSet;
  }

  async getApplicantStatus(applicantId: string): Promise<InSumsubGettingApplicantStatusDTO> {
    return {
      id: `id_${Date.now()}`,
      status: {
        id: `id_${Date.now()}`,
        inspectionId: `inspection_id_${Date.now()}`,
        applicantId,
        jobId: `job_${Date.now()}`,
        createDate: `${Date.now()}`,
        reviewStatus: SumsubReviewStatuses.completed,
        reviewResult: {
          clientComment: 'toplevel client comment',
          moderationComment: 'toplevel moderation comment',
          rejectLabels: [],
          reviewAnswer: SumSubVerificationLabels.GREEN,
        },
        notificationFailureCnt: Date.now(),
      },
      documentStatus: [ {
        idDocType : SumsubSupportedDocumentTypes.SELFIE,
        country : 'DZA',
        imageId : 1300900877,
        reviewResult : {
          moderationComment : 'Selfie moderation comment',
          clientComment : 'Selfie client comment',
          reviewAnswer : SumSubVerificationLabels.GREEN,
        },
        addedDate : '2019-04-04 08:31:52',
      }, {
        idDocType : SumsubSupportedDocumentTypes.DRIVERS,
        country : 'DZA',
        imageId : 54764458,
        reviewResult : {
          moderationComment : 'Drivers moderation comment',
          clientComment : 'Drivers moderation comment',
          reviewAnswer : SumSubVerificationLabels.GREEN,
        },
        addedDate : '2019-04-04 08:31:52',
      } ],
    };
  }

  async getApplicantData(applicantId: string): Promise<InSumsubGetApplicantDataDTO> {
    return {
      list: {
        items: [
          {
            id: applicantId,
            info: {
              idDocs: [
                {
                  country: 'USA',
                  idDocType: SumsubSupportedDocumentTypes.PASSPORT,
                  number: `passport_of_${applicantId}`,
                },
              ],
            },
            requiredIdDocs: {
              country: 'AFG',
              docSets: [
                {
                  idDocSetType: SumsubCreateApplicantDocTypes.SELFIE,
                  types: [
                    SumsubSupportedDocumentTypes.SELFIE,
                  ],
                  subTypes: undefined,
                },
                {
                  idDocSetType: SumsubCreateApplicantDocTypes.IDENTITY,
                  types: [
                    SumsubSupportedDocumentTypes.ID_CARD,
                    SumsubSupportedDocumentTypes.PASSPORT,
                    SumsubSupportedDocumentTypes.DRIVERS,
                    SumsubSupportedDocumentTypes.RESIDENCE_PERMIT,
                  ],
                  subTypes: [
                    'FRONT_SIDE',
                    'BACK_SIDE',
                  ],
                },
              ],
            },
            review: {
              reviewResult: {
                clientComment: 'client comment',
                moderationComment: 'moderation comment',
                reviewAnswer: SumSubVerificationLabels.GREEN,
              },
              reviewStatus: SumsubReviewStatuses.completed,
            },
          },
        ],
        totalItems: 1,
      },
    };
  }

  async getPhoto(inspectionId: string, imageId: number): Promise<IFileElement> {
    // PNG image 1x1
    const buffer = Buffer.from([ 137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 2, 0, 0, 0, 144,
      119, 83, 222, 0, 0, 0, 1, 115, 82, 71, 66, 0, 174, 206, 28, 233, 0, 0, 0, 4, 103, 65, 77, 65, 0, 0, 177, 143, 11, 252, 97, 5, 0, 0, 0, 9,
      112, 72, 89, 115, 0, 0, 14, 195, 0, 0, 14, 195, 1, 199, 111, 168, 100, 0, 0, 0, 12, 73, 68, 65, 84, 24, 87, 99, 80, 80, 80, 0, 0, 0, 196,
      0, 97, 131, 79, 62, 140, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130 ]);

    return {
      buffer,
      mimetype: 'image/png',
      originalname: `${inspectionId}.${imageId}.png`,
      fieldname: `${inspectionId}.${imageId}`,
    };
  }
}