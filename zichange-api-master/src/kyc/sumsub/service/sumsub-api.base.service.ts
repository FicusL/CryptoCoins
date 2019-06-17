import { ISumsubCreateApplicantBody } from '../types/create-applicant/sumsub.create-applicant-body.interface';
import { InSumsubCreateApplicantDTO } from '../dto/in.sumsub.create-applicant.dto';
import { ISumsubAddingDocumentMetadata } from '../types/adding-document/sumsub.adding-document-metadata.interface';
import { InSumsubAddingDocumentDTO } from '../dto/in.sumsub.adding-document.dto';
import {
  InSumsubGettingApplicantStatusDocumentItemDTO,
  InSumsubGettingApplicantStatusDTO,
  SumSubVerificationLabels,
} from '../dto/in.sumsub.getting-applicant-status.dto';
import { InSumsubGetApplicantDataDTO } from '../dto/in.sumsub.get-applicant-data.dto';
import { ISumsubCreateApplicantInfo } from '../types/create-applicant/sumsub.create-applicant-info.interface';
import { SumsubSupportedDocumentTypes } from '../types/sumsub.supported-document-types';
import { OutKycLastSentDocumentsInfoDTO, OutKycLastSentDocumentsInfoItemDTO } from '../../dto/out.kyc.last-sent-documents-info.dto';
import { ILastSentDocuments } from '../../abstract/kyc.last-sent-documents.interface';
import { OutKycInfoFromSumsubDTO } from '../../dto/out.kyc.info-from-sumsub.dto';
import { IFileElement } from '../../../core/abstract/file.element.interface';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { ISumsubCreateApplicantRequiredDocs } from '../types/create-applicant/sumsub-create-applicant-required-docs.interface';

export abstract class SumsubApiBaseService {
  // region Abstract methods

  abstract createApplicant(params: ISumsubCreateApplicantBody): Promise<InSumsubCreateApplicantDTO>;
  abstract changeApplicantData(applicantId: string, info: ISumsubCreateApplicantInfo, oldInfo: ISumsubCreateApplicantInfo | undefined): Promise<void>;
  abstract changeRequiredDocumentSet(applicantId: string, docSet: ISumsubCreateApplicantRequiredDocs): Promise<ISumsubCreateApplicantRequiredDocs>;
  abstract addDocument(applicantId: string, metadata: ISumsubAddingDocumentMetadata, content: Buffer, fileExtension: string)
    : Promise<InSumsubAddingDocumentDTO>;
  abstract getApplicantStatus(applicantId: string): Promise<InSumsubGettingApplicantStatusDTO>;
  abstract getApplicantData(applicantId: string): Promise<InSumsubGetApplicantDataDTO>;
  abstract getPhoto(inspectionId: string, imageId: number): Promise<IFileElement>;

  // endregion

  // region Public methods

  // TODO: add tests for this function
  public async getSumSubInfo(sumSubApplicantId: string, availableDocumentTypes: SumsubSupportedDocumentTypes[]): Promise<OutKycInfoFromSumsubDTO> {
    const [ data, status ] = await Promise.all([
      this.getApplicantData(sumSubApplicantId),
      this.getApplicantStatus(sumSubApplicantId),
    ]);

    let amlReason: string | undefined;

    if (status.status.reviewResult) {
      amlReason = status.status.reviewResult.clientComment;
    }

    const lastSentDocumentsInfo = this.statusToLastSentDocuments(data, status, availableDocumentTypes);
    const clientReason = this.getClientReason(status, lastSentDocumentsInfo);

    return { data, status, clientReason, amlReason, lastSentDocumentsInfo };
  }

  // endregion

  // region Private methods

  private getClientReason(status: InSumsubGettingApplicantStatusDTO, info: OutKycLastSentDocumentsInfoDTO): string | undefined {
    const reviewResult = status.status.reviewResult;

    if (reviewResult && reviewResult.moderationComment) {
      return reviewResult.moderationComment;
    }

    const commentsForPhotos: string[] = [];
    if (info.selfie.mustSend && info.selfie.moderationComment) {
      commentsForPhotos.push(info.selfie.moderationComment);
    }

    if (info.documentFront.mustSend && info.documentFront.moderationComment) {
      commentsForPhotos.push(info.documentFront.moderationComment);
    }

    if (info.documentBack.mustSend && info.documentBack.moderationComment) {
      commentsForPhotos.push(info.documentBack.moderationComment);
    }

    if (commentsForPhotos.length === 0) {
      return '';
    } else if (commentsForPhotos.length === 1) {
      return commentsForPhotos[0];
    } else {
      return 'We were unable to verify one or both of your documents. Please retry verification and upload photos.';
    }
  }

  private statusToLastSentDocuments(
    data: InSumsubGetApplicantDataDTO,
    status: InSumsubGettingApplicantStatusDTO,
    availableDocumentTypes: SumsubSupportedDocumentTypes[],
  ): OutKycLastSentDocumentsInfoDTO {
    const lastDocuments = this.getLastSentDocuments(status, availableDocumentTypes);
    const { lastSelfie, lastDocumentFront, lastDocumentBack } = lastDocuments;

    const result: OutKycLastSentDocumentsInfoDTO = {
      lastSentDocumentType: lastDocumentFront ? lastDocumentFront.idDocType : undefined,
      inspectionId: status.status.inspectionId,
      documentFront: this.getLastSentDocumentsInfo(lastDocumentFront),
      documentBack: this.getLastSentDocumentsInfo(lastDocumentBack),
      selfie: this.getLastSentDocumentsInfo(lastSelfie),
      documentIsDoubleSided: this.documentIsDoubleSided(data),
    };

    if (!result.documentFront.idDocSubType) {
      result.documentBack.mustSend = false;
    }

    return result;
  }

  private documentIsDoubleSided(data: InSumsubGetApplicantDataDTO): boolean {
    if (data.list.items.length === 0) {
      Logger.error('data.list.items.length === 0', undefined, SumsubApiBaseService.name);
      throw new InternalServerErrorException('Applicant data not found');
    }

    const founded = data.list.items[0].requiredIdDocs.docSets.find(item => item.idDocSetType === 'IDENTITY');
    if (!founded) {
      Logger.error('!founded', undefined, SumsubApiBaseService.name);
      throw new InternalServerErrorException('Applicant required IDENTITY documents not found');
    }

    if (!founded.subTypes) {
      return false;
    }

    return founded.subTypes.includes('BACK_SIDE') && founded.subTypes.includes('FRONT_SIDE');
  }

  private getLastSentDocumentsInfo(lastDocument: InSumsubGettingApplicantStatusDocumentItemDTO | undefined): OutKycLastSentDocumentsInfoItemDTO {
    let mustSend = true;
    let reviewAnswer: SumSubVerificationLabels | undefined;
    let moderationComment: string | undefined;
    let clientComment: string | undefined;

    if (lastDocument) {
      if (lastDocument.reviewResult) {
        moderationComment = lastDocument.reviewResult.moderationComment;
        clientComment = lastDocument.reviewResult.clientComment;
        reviewAnswer = lastDocument.reviewResult.reviewAnswer;

        if (lastDocument.reviewResult.reviewAnswer === SumSubVerificationLabels.GREEN) {
          mustSend = false;
        }
      } else {
        mustSend = false;
      }
    }

    return {
      mustSend,
      reviewAnswer,
      clientComment,
      moderationComment,
      imageId: lastDocument ? lastDocument.imageId : undefined,
      idDocSubType: lastDocument ? lastDocument.idDocSubType : undefined,
    };
  }

  private getLastDocument(
    lastDocument: InSumsubGettingApplicantStatusDocumentItemDTO | undefined,
    item: InSumsubGettingApplicantStatusDocumentItemDTO,
  ): InSumsubGettingApplicantStatusDocumentItemDTO | undefined {
    if (lastDocument) {

      const lastDate = (new Date(lastDocument.addedDate)).getTime();
      const currentDate = (new Date(item.addedDate)).getTime();

      if (currentDate > lastDate) {
        return item;
      }

      return lastDocument;
    }

    return item;
  }

  private getLastSentDocuments(
    status: InSumsubGettingApplicantStatusDTO,
    availableDocumentTypes: SumsubSupportedDocumentTypes[],
  ): ILastSentDocuments {
    if (!status.documentStatus) {
      return { lastSelfie: undefined, lastDocumentFront: undefined, lastDocumentBack: undefined };
    }

    let lastSelfie: InSumsubGettingApplicantStatusDocumentItemDTO | undefined;
    let lastDocumentFront: InSumsubGettingApplicantStatusDocumentItemDTO | undefined;
    let lastDocumentBack: InSumsubGettingApplicantStatusDocumentItemDTO | undefined;

    status.documentStatus.forEach(item => {
      if (item.idDocType === SumsubSupportedDocumentTypes.SELFIE) {
        lastSelfie = this.getLastDocument(lastSelfie, item);
      }

      if (availableDocumentTypes.includes(item.idDocType)) {
        if (!item.idDocSubType || item.idDocSubType === 'FRONT_SIDE') {
          lastDocumentFront = this.getLastDocument(lastDocumentFront, item);
        }

        if (item.idDocSubType === 'BACK_SIDE') {
          lastDocumentBack = this.getLastDocument(lastDocumentBack, item);
        }
      }
    });

    return { lastSelfie, lastDocumentFront, lastDocumentBack };
  }

  // endregion
}