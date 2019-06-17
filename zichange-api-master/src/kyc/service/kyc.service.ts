import { KycEntity } from '../entity/kyc.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { KycRepository } from '../repository/kyc.repository';
import { AccountEntity } from '../../account/entitiy/account.entity';
import { InKycChangeStatusDto } from '../dto/in.kyc.change.status.dto';
import { KycStatus } from '../const/kyc.status';
import { OutKycStatusDto } from '../dto/out.kyc.status.dto';
import { KycExceptions } from '../const/kyc.exceptions';
import { OutKycDto } from '../dto/out.kyc.dto';
import { EventBus } from '@nestjs/cqrs';
import { KycUpdateKycStatusEvent } from '../events/impl/kyc.update-kyc-status.event';
import { IKycGetFilters } from '../abstract/kyc.get-filters.interface';
import { SumsubApiBaseService } from '../sumsub/service/sumsub-api.base.service';
import { OutKycInfoFromSumsubDTO } from '../dto/out.kyc.info-from-sumsub.dto';
import { Injectable, Logger } from '@nestjs/common';
import { kycAvailableDocumentTypes } from '../const/kyc.available-document-types';

@Injectable()
export class KycService {
  constructor(
    protected readonly eventBus: EventBus,

    protected readonly sumsubApiBaseService: SumsubApiBaseService,

    @InjectRepository(KycRepository)
    protected readonly kycRepository: KycRepository,
  ) { }

  // region Public methods

  async getKycWithFilters(filters: IKycGetFilters): Promise<KycEntity[]> {
    return await this.kycRepository.getWithFiltersWithRelations(filters);
  }

  async getAmountOfKYC(filters: IKycGetFilters): Promise<number> {
    return await this.kycRepository.getAmountEntities(filters);
  }

  async getAllKycDTO(): Promise<OutKycDto[]> {
    const result =  await this.kycRepository.getAllWithRelations();
    return result.map(el => new OutKycDto(el));
  }

  async getAllPendingKycDTO(): Promise<OutKycDto[]> {
    const result =  await this.kycRepository.getAllPendingWithRelations();
    return result.map(el => new OutKycDto(el));
  }

  async setKycState(account: AccountEntity, body: any) {
    let kyc = account.kyc;

    if (!kyc) {
      kyc = new KycEntity();
      kyc.account = account;
      kyc.status = KycStatus.Unapproved;
    }

    kyc.frontendState = body;

    return await this.saveKyc(kyc);
  }

  async getSumSubInfoSafety(kyc: KycEntity): Promise<OutKycInfoFromSumsubDTO | undefined> {
    try {
      if (kyc.sumSubApplicantId) {
        return await this.sumsubApiBaseService.getSumSubInfo(kyc.sumSubApplicantId, kycAvailableDocumentTypes);
      }
    } catch (e) {
      Logger.error(e.message, undefined, KycService.name);
    }

    return undefined;
  }

  async getSumSubInfoByAccountId(account: AccountEntity): Promise<OutKycInfoFromSumsubDTO> {
    const kyc = await this.findMainKycByAccount(account);

    if (!kyc.sumSubApplicantId) {
      throw new KycExceptions.KycNotExistsInSumSub();
    }

    return await this.sumsubApiBaseService.getSumSubInfo(kyc.sumSubApplicantId, kycAvailableDocumentTypes);
  }

  async findMainKycByAccount(account: AccountEntity): Promise<KycEntity> {
    const kyc = await this.kycRepository.findByAccount(account);

    if (!kyc) {
      throw new KycExceptions.KYCNotFound();
    }

    return kyc;
  }

  async changeStatus(adminAccount: AccountEntity, account: AccountEntity, changeData: InKycChangeStatusDto) {
    let kyc = account.kyc;
    if (!kyc) {
      throw new KycExceptions.KYCNotFound();
    }

    kyc.lastEditBy = adminAccount;
    kyc.status = changeData.status;
    kyc.rejectReason = changeData.rejectReason;

    if (!kyc.rejectReason) {
      kyc.rejectReason = undefined;
    }

    kyc = await this.saveKyc(kyc);
    this.eventBus.publish(new KycUpdateKycStatusEvent(kyc, account));
  }

  async getKycStatusDTO(account: AccountEntity): Promise<OutKycStatusDto> {
    const kyc = await this.findMainKycByAccount(account);
    return new OutKycStatusDto(kyc);
  }

  async getKycDto(account: AccountEntity): Promise<OutKycDto> {
    const kyc = await this.findMainKycByAccount(account);
    const sumSubInfo = await this.getSumSubInfoSafety(kyc);
    return new OutKycDto(kyc, sumSubInfo);
  }

  async getAllFileNamesWithOutRejected(): Promise<string[]> {
    return await this.kycRepository.getAllFileNamesWithOutRejected();
  }

  async resetRejectStatus(account: AccountEntity) {
    let kyc = await this.findMainKycByAccount(account);

    if (kyc.status === KycStatus.Tier1Rejected) {
      kyc.status = KycStatus.Unapproved;
    } else if (kyc.status === KycStatus.Tier2Rejected) {
      kyc.status = KycStatus.Tier1Approved;
    } else {
      return;
    }

    kyc = await this.kycRepository.save(kyc);

    this.eventBus.publish(new KycUpdateKycStatusEvent(kyc, account));
  }

  static generateArchiveFileName(fileName: string) {
    return `${fileName}.7z`;
  }

  // endregion

  // region Private methods

  private async saveKyc(mainEntity: KycEntity): Promise<KycEntity> {
    try {
      return await this.kycRepository.save(mainEntity);
    } catch (e) {
      Logger.error(e.message, undefined, KycService.name);
      throw new KycExceptions.UnknownError();
    }
  }

  // endregion
}