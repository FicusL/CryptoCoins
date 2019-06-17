import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { KycPdfHelperService } from './kyc.pdf-helper.service';
import { SumsubApiBaseService } from '../sumsub/service/sumsub-api.base.service';
import { KycRepository } from '../repository/kyc.repository';
import { KycEntity } from '../entity/kyc.entity';
import { KycStatus } from '../const/kyc.status';
import { KycExceptions } from '../const/kyc.exceptions';
import { IFileElement } from '../../core/abstract/file.element.interface';
import { FileUtils } from '../../core/util/file-utils';
import { InKycNaturalCreateDto } from '../dto/natural/in.kyc.natural.create.dto';
import {
  convertInnerDocumentTypeToSumSub,
  naturalKycCreateApplicantRequiredDocs,
  naturalKycDtoToCreateApplicantBody,
} from '../sumsub/utils/sumsub.convert-utils';
import { SumsubReviewStatuses } from '../sumsub/types/sumsub.review-statuses';
import { ISumsubAddingDocumentMetadata } from '../sumsub/types/adding-document/sumsub.adding-document-metadata.interface';
import { SumsubSupportedDocumentTypes } from '../sumsub/types/sumsub.supported-document-types';
import { innerCountryToSumSub } from '../../core/util/country-utils';
import { OutKycDto } from '../dto/out.kyc.dto';
import { KycNaturalPdfCreator } from '../pdf/kyc.natural.pdf-creator';
import { KycAddKycEvent } from '../events/impl/kyc.add-kyc.event';
import { InKycLegalCreateDTO } from '../dto/legal/in.kyc.legal.create.dto';
import { KycLegalPdfCreator } from '../pdf/kyc.legal.pdf-creator';
import { EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from '../../account/entitiy/account.entity';
import { AccountRepository } from '../../account/repository/account.repository';
import { kycAvailableDocumentTypes } from '../const/kyc.available-document-types';
import { ISumsubCreateApplicantInfo } from '../sumsub/types/create-applicant/sumsub.create-applicant-info.interface';
import { OutKycInfoFromSumsubDTO } from '../dto/out.kyc.info-from-sumsub.dto';
import { KycUpdateKycStatusEvent } from '../events/impl/kyc.update-kyc-status.event';

@Injectable()
export class KycCreateService {
  constructor(
    protected readonly eventBus: EventBus,

    protected readonly kycPdfHelperService: KycPdfHelperService,
    protected readonly sumsubApiBaseService: SumsubApiBaseService,

    @InjectRepository(KycRepository)
    protected readonly kycRepository: KycRepository,

    @InjectRepository(AccountRepository)
    protected readonly accountRepository: AccountRepository,
  ) { }

  // region Public Methods

  async createNatural(account: AccountEntity, dto: InKycNaturalCreateDto, optionalFiles: IFilesOptional): Promise<OutKycDto> {
    this.checkFilesSize(optionalFiles.selfie, 'selfie');
    this.checkFilesSize(optionalFiles.documentFront, 'front side of identity document');
    this.checkFilesSize(optionalFiles.documentBack, 'back side of identity document');

    let kyc = await this.kycRepository.findByAccount(account);

    this.verify(kyc);
    kyc = kyc || new KycEntity();
    kyc.phone = dto.personalInformation.contactPhone;

    const sumsubInfo =
      kyc.sumSubApplicantId ? await this.sumsubApiBaseService.getSumSubInfo(kyc.sumSubApplicantId, kycAvailableDocumentTypes) : undefined;

    const files = await this.getFiles(optionalFiles, dto, sumsubInfo);
    files.selfie = await this.convertToImage(files.selfie);
    files.documentFront = await FileUtils.convertPdfFileToPng(files.documentFront);
    files.documentBack = files.documentBack ? await FileUtils.convertPdfFileToPng(files.documentBack) : files.documentBack;

    const pdfCreator = new KycNaturalPdfCreator(dto, files, account.email, account.id);
    const pdf = await this.kycPdfHelperService.createPDF(pdfCreator, account);

    // TODO: copy - paste
    kyc.fileName = pdf.fileName;
    kyc.account = account;
    kyc.lastEditBy = account;
    kyc.status = KycStatus.Tier1Pending;

    const sendResult = await this.sumsubNaturalSend(kyc, optionalFiles, dto, sumsubInfo);

    kyc.sumSubApplicantId = sendResult.sumSubApplicantId;
    kyc.sumSubStatus = sendResult.sumSubStatus;
    kyc.sumSubDocumentNumber = sendResult.sumSubDocumentNumber;
    kyc.lastSentSumSubInfo = sendResult.lastSentSumSubInfo;

    kyc = await this.saveKyc(kyc);

    this.eventBus.publish(new KycAddKycEvent({ kyc, account, buffer: pdf.buffer }));
    this.eventBus.publish(new KycUpdateKycStatusEvent(kyc, account));
    return new OutKycDto(kyc);
  }

  async createLegal(account: AccountEntity, dto: InKycLegalCreateDTO): Promise<OutKycDto> {
    let kyc = await this.kycRepository.findByAccount(account);

    this.verify(kyc);
    kyc = kyc || new KycEntity();
    kyc.phone = dto.representativeData.contactPhone;
    // kyc.phone = dto.customerInformation.contactPhone;

    account.counterpartyName = dto.customerInformation.companyName;
    account = await this.accountRepository.save(account);

    const pdfCreator = new KycLegalPdfCreator(dto, account.email, account.id);
    const pdf = await this.kycPdfHelperService.createPDF(pdfCreator, account);

    // TODO: copy - paste
    kyc.fileName = pdf.fileName;
    kyc.account = account;
    kyc.lastEditBy = account;
    kyc.status = KycStatus.Tier1Pending;

    kyc = await this.saveKyc(kyc);

    this.eventBus.publish(new KycAddKycEvent({ kyc, account, buffer: pdf.buffer }));
    this.eventBus.publish(new KycUpdateKycStatusEvent(kyc, account));
    return new OutKycDto(kyc);
  }

  // endregion

  // region Private Methods

  private async convertToImage(file: Readonly<IFileElement>): Promise<IFileElement> {
    if (FileUtils.fileIsPdf(file)) {
      return await FileUtils.convertPdfFileToPng(file);
    }

    return file;
  }

  private async getFiles(
    optionalFiles: IFilesOptional,
    dto: InKycNaturalCreateDto,
    sumsubInfo: OutKycInfoFromSumsubDTO | undefined,
  ): Promise<IFiles> {
    const documentIsDoubleSided = dto.personalInformation.documentIsDoubleSided;
    let selfie = optionalFiles.selfie;
    let documentFront = optionalFiles.documentFront;
    let documentBack = optionalFiles.documentBack;

    if (selfie && documentFront) {
      if (documentIsDoubleSided) {
        if (documentBack) {
          return { selfie, documentFront, documentBack };
        }
      } else {
        return { selfie, documentFront };
      }
    }

    if (!sumsubInfo) {
      if (documentIsDoubleSided) {
        throw new KycExceptions.FilesMustBeSent([ 'selfie', 'documentFront', 'documentBack' ]);
      } else {
        throw new KycExceptions.FilesMustBeSent([ 'selfie', 'documentFront' ]);
      }
    }

    const info = sumsubInfo.lastSentDocumentsInfo;
    const currentSentDocumentType = convertInnerDocumentTypeToSumSub(dto.personalInformation.documentType);

    if (info.lastSentDocumentType !== currentSentDocumentType) {
      if (documentIsDoubleSided) {
        throw new KycExceptions.FilesMustBeSent([ 'selfie', 'documentFront', 'documentBack' ]);
      } else {
        throw new KycExceptions.FilesMustBeSent([ 'selfie', 'documentFront' ]);
      }
    }

    if (info.selfie.mustSend && !selfie) {
      throw new KycExceptions.FilesMustBeSent([ 'selfie' ]);
    }

    if (info.documentFront.mustSend && !documentFront) {
      throw new KycExceptions.FilesMustBeSent([ 'documentFront' ]);
    }

    if (info.documentBack.mustSend && !documentBack) {
      throw new KycExceptions.FilesMustBeSent([ 'documentBack' ]);
    }

    if (!selfie) {
      if (info.selfie.imageId) {
        selfie = await this.sumsubApiBaseService.getPhoto(info.inspectionId, info.selfie.imageId);
      } else {
        throw new InternalServerErrorException('Selfie image id not found');
      }
    }

    if (!documentFront) {
      if (info.documentFront.imageId) {
        documentFront = await this.sumsubApiBaseService.getPhoto(info.inspectionId, info.documentFront.imageId);
      } else {
        throw new InternalServerErrorException('Front side of identity document image id not found');
      }
    }

    if (!documentBack && documentIsDoubleSided) {
      if (info.documentBack.imageId) {
        documentBack = await this.sumsubApiBaseService.getPhoto(info.inspectionId, info.documentBack.imageId);
      } else {
        throw new InternalServerErrorException('Back side of identity document image id not found');
      }
    }

    return { selfie, documentFront, documentBack };
  }

  private verify(foundKyc: KycEntity | undefined): void {
    if (!foundKyc) {
      return;
    }

    const kycCanSend = foundKyc.status === KycStatus.Unapproved || foundKyc.status === KycStatus.Tier1Rejected;
    if (!kycCanSend) {
      throw new KycExceptions.KycAlreadySent();
    }

    if (foundKyc.forbiddenSend) {
      throw new KycExceptions.ForbiddenSend();
    }
  }

  private async saveKyc(mainEntity: KycEntity): Promise<KycEntity> {
    try {
      return await this.kycRepository.save(mainEntity);
    } catch (e) {
      Logger.error(e.message, undefined, KycCreateService.name);
      throw new KycExceptions.UnknownError();
    }
  }

  private checkFilesSize(file: IFileElement | undefined, label: string) {
    if (!file) {
      return;
    }

    const maxMegabyte = 25;
    const maxPhotoSizeInBytes = maxMegabyte * 1024 * 1024;

    if (FileUtils.getFileSize(file) > maxPhotoSizeInBytes) {
      throw new KycExceptions.MaximumPhotoSizeExceeded(label, maxMegabyte);
    }
  }

  private async sumsubNaturalSend(
    kyc: Readonly<KycEntity>,
    files: IFilesOptional,
    dto: InKycNaturalCreateDto,
    sumsubInfo: OutKycInfoFromSumsubDTO | undefined,
  ): Promise<ISumSubSendResult> {
    const params = naturalKycDtoToCreateApplicantBody(dto);
    let sumSubStatus: SumsubReviewStatuses;
    let sumSubApplicantId: string;
    let sumSubDocumentNumber: string | undefined;

    if (kyc.sumSubApplicantId) {
      await this.sumsubApiBaseService.changeApplicantData(kyc.sumSubApplicantId, params.info, kyc.lastSentSumSubInfo);

      sumSubStatus = SumsubReviewStatuses.pending;
      sumSubApplicantId = kyc.sumSubApplicantId;
    } else {
      const applicant = await this.sumsubApiBaseService.createApplicant(params);

      sumSubStatus = applicant.review.reviewStatus;
      sumSubApplicantId = applicant.id;
      sumSubDocumentNumber = null as any;
    }

    // send files
    if (files.selfie) {
      const selfieMetadata: ISumsubAddingDocumentMetadata = {
        idDocType: SumsubSupportedDocumentTypes.SELFIE,
        country: innerCountryToSumSub(dto.personalInformation.country),
      };

      const selfieExt = FileUtils.getFileExtension(files.selfie);
      await this.sumsubApiBaseService.addDocument(sumSubApplicantId, selfieMetadata, files.selfie.buffer, selfieExt);
    }

    if (sumsubInfo) {
      if (sumsubInfo.lastSentDocumentsInfo.documentIsDoubleSided !== dto.personalInformation.documentIsDoubleSided) {
        const newRequiredDocs = naturalKycCreateApplicantRequiredDocs(dto);

        await this.sumsubApiBaseService.changeRequiredDocumentSet(sumSubApplicantId, newRequiredDocs);
      }
    }

    if (files.documentFront) {
      const documentFrontMetadata: ISumsubAddingDocumentMetadata = {
        idDocType: convertInnerDocumentTypeToSumSub(dto.personalInformation.documentType),
        idDocSubType: dto.personalInformation.documentIsDoubleSided ? 'FRONT_SIDE' : undefined,
        country: innerCountryToSumSub(dto.personalInformation.country),
      };

      const documentExt = FileUtils.getFileExtension(files.documentFront);
      await this.sumsubApiBaseService.addDocument(sumSubApplicantId, documentFrontMetadata, files.documentFront.buffer, documentExt);
    }

    if (files.documentBack && dto.personalInformation.documentIsDoubleSided) {
      const documentBackMetadata: ISumsubAddingDocumentMetadata = {
        idDocType: convertInnerDocumentTypeToSumSub(dto.personalInformation.documentType),
        idDocSubType: 'BACK_SIDE',
        country: innerCountryToSumSub(dto.personalInformation.country),
      };

      const documentExt = FileUtils.getFileExtension(files.documentBack);
      await this.sumsubApiBaseService.addDocument(sumSubApplicantId, documentBackMetadata, files.documentBack.buffer, documentExt);
    }

    return {
      sumSubStatus,
      sumSubApplicantId,
      sumSubDocumentNumber,
      lastSentSumSubInfo: params.info,
    };
  }

  // endregion
}

// region Interfaces

interface IFiles {
  selfie: IFileElement;
  documentFront: IFileElement;
  documentBack?: IFileElement;
}

interface IFilesOptional {
  selfie?: IFileElement;
  documentFront?: IFileElement;
  documentBack?: IFileElement;
}

interface ISumSubSendResult {
  sumSubStatus: SumsubReviewStatuses;
  sumSubApplicantId: string;
  sumSubDocumentNumber: string | undefined;
  lastSentSumSubInfo: ISumsubCreateApplicantInfo;
}

// endregion