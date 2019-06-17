import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { SumsubApiBaseService } from '../sumsub/service/sumsub-api.base.service';
import { waitMiliseconds } from '../../core/util/wait-ms';
import { KycRepository } from '../repository/kyc.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { InSumsubGettingApplicantStatusDTO, SumSubVerificationLabels } from '../sumsub/dto/in.sumsub.getting-applicant-status.dto';
import { KycEntity } from '../entity/kyc.entity';
import { KycStatus } from '../const/kyc.status';
import { InSumsubGetApplicantDataDTO } from '../sumsub/dto/in.sumsub.get-applicant-data.dto';
import { SumsubAvailableIdentityDocTypes } from '../sumsub/const/sumsub.available-identity-doc-types';
import { SumsubReviewStatuses } from '../sumsub/types/sumsub.review-statuses';
import { AccountRepository } from '../../account/repository/account.repository';
import { ConfigsService } from '../../core/service/configs.service';
import { SumsubReviewRejectType } from '../sumsub/const/sumsub.review-reject-type.enum';
import { KycUpdateKycStatusEvent } from '../events/impl/kyc.update-kyc-status.event';
import { EventBus } from '@nestjs/cqrs';
import { AccountEntity } from '../../account/entitiy/account.entity';

@Injectable()
export class KycSumsubCheckerService implements OnApplicationBootstrap {
  constructor(
    protected readonly eventBus: EventBus,

    @InjectRepository(KycRepository)
    protected readonly kycRepository: KycRepository,

    @InjectRepository(AccountRepository)
    protected readonly accountRepository: AccountRepository,

    protected readonly sumsubApiBaseService: SumsubApiBaseService,
  ) { }

  onApplicationBootstrap() {
    this.startLoop();
  }

  protected async startLoop() {
    while (true) {
      try {
        await this.checkIteration();
      } catch (e) {
        Logger.error(e.message, undefined, KycSumsubCheckerService.name);
      }

      await waitMiliseconds(5 * 60 * 1000);
    }
  }

  protected async checkIteration() {
    const lastEditDateStart = ConfigsService.isProduction ? new Date(Date.now() - 60 * 60 * 1000) : new Date('2010.01.01');

    const entities = await this.kycRepository.getKycForCheckingInSumsub(lastEditDateStart);

    for (const kyc of entities) {
      await this.processKyc(kyc);
    }
  }

  async processKyc(kyc: KycEntity) {
    if (!kyc.sumSubApplicantId) {
      return;
    }

    let status: InSumsubGettingApplicantStatusDTO;
    try {
      status = await await this.sumsubApiBaseService.getApplicantStatus(kyc.sumSubApplicantId);
    } catch (e) {
      Logger.error(e.message, undefined, KycSumsubCheckerService.name);
      return;
    }

    const account = await this.accountRepository.getAccountById(kyc.accountId);
    if (!account) {
      Logger.error(`Account not found: id = ${kyc.accountId}`, undefined, KycSumsubCheckerService.name);
      return;
    }

    let mustSave = kyc.sumSubStatus !== status.status.reviewStatus;
    kyc.sumSubStatus = status.status.reviewStatus;

    if (status.status.reviewResult) {
      if (kyc.rejectReason !== status.status.reviewResult.moderationComment) {
        kyc.rejectReason = status.status.reviewResult.moderationComment;
        mustSave = true;
      }

      const forbiddenSend = status.status.reviewResult.reviewRejectType === SumsubReviewRejectType.FINAL;
      if (kyc.forbiddenSend !== forbiddenSend) {
        kyc.forbiddenSend = forbiddenSend;
        mustSave = true;
      }
    }

    if (status.status.reviewStatus === SumsubReviewStatuses.awaitingUser) {
      await this.processAwaitingUser(kyc, account);
      return;
    }

    if (status.status.reviewResult) {
      kyc.sumSubDocumentNumber = await this.getApplicantDocumentNumber(kyc.sumSubApplicantId);

      const reviewAnswer = status.status.reviewResult.reviewAnswer;
      const isDuplicate = this.isDuplicate(status);

      if (isDuplicate) {
        await this.processDuplicate(kyc, account);
        return;
      }

      if (reviewAnswer === SumSubVerificationLabels.GREEN) {
        await this.processGreen(kyc, account);
        return;
      }

      if (reviewAnswer === SumSubVerificationLabels.RED) {
        await this.processRed(kyc, account);
        return;
      }
    }

    if (mustSave) {
      await this.kycRepository.save(kyc);
    }
  }

  // region Handlers

  protected async processAwaitingUser(kyc: KycEntity, account: AccountEntity) {
    kyc.status = KycStatus.Tier1Rejected;

    const savedKyc = await this.kycRepository.save(kyc);

    this.eventBus.publish(new KycUpdateKycStatusEvent(savedKyc, account));
  }

  protected async processDuplicate(kyc: KycEntity, account: AccountEntity) {
    if (kyc.sumSubDocumentNumber) {
      const foundedKyc = await this.kycRepository.findKycBySumSubDocumentNumber(kyc.sumSubDocumentNumber);

      if (foundedKyc) {
        const [ mainAccount, linkedAccount ] = await Promise.all([
          this.accountRepository.getAccountFull(foundedKyc.accountId),
          this.accountRepository.getAccountFull(kyc.accountId),
        ]);

        if (mainAccount && linkedAccount) {
          const mustBlock = !mainAccount.mustRegister && !linkedAccount.mustRegister;

          if (mustBlock) {
            await this.accountRepository.blockDuplicateAccount(linkedAccount);
          } else {
            await this.accountRepository.linkAccounts({
              mainAccountId: mainAccount.id,
              linkedAccountId: linkedAccount.id,
            });
          }
        }
      }
    }

    kyc.status = KycStatus.Tier1Rejected;

    const savedKyc = await this.kycRepository.save(kyc);

    this.eventBus.publish(new KycUpdateKycStatusEvent(savedKyc, account));
  }

  protected async processGreen(kyc: KycEntity, account: AccountEntity) {
    kyc.status = KycStatus.Tier1Approved;

    const savedKyc = await this.kycRepository.save(kyc);

    this.eventBus.publish(new KycUpdateKycStatusEvent(savedKyc, account));
  }

  protected async processRed(kyc: KycEntity, account: AccountEntity) {
    kyc.status = KycStatus.Tier1Rejected;

    const savedKyc = await this.kycRepository.save(kyc);

    this.eventBus.publish(new KycUpdateKycStatusEvent(savedKyc, account));
  }

  // endregion

  protected isDuplicate(status: InSumsubGettingApplicantStatusDTO): boolean {
    if (!status.status.reviewResult) {
      return false;
    }

    if (!status.status.reviewResult.rejectLabels) {
      return false;
    }

    return status.status.reviewResult.rejectLabels.includes('DUPLICATE');
  }

  protected async getApplicantDocumentNumber(sumSubApplicantId: string): Promise<string | undefined> {
    let data: InSumsubGetApplicantDataDTO;

    try {
      data = await await this.sumsubApiBaseService.getApplicantData(sumSubApplicantId);
    } catch (e) {
      Logger.error(e.message, undefined, KycSumsubCheckerService.name);
      return undefined;
    }

    const foundedItem = data.list.items.find(item => item.id === sumSubApplicantId);
    if (!foundedItem) {
      Logger.error(`Item not found. applicantId: ${sumSubApplicantId}. Data: ${JSON.stringify(data)}`,
        undefined, KycSumsubCheckerService.name);
      return undefined;
    }

    if (!foundedItem.info.idDocs) {
      return undefined;
    }

    for (const doc of foundedItem.info.idDocs) {
      if (SumsubAvailableIdentityDocTypes.includes(doc.idDocType)) {
        return doc.number;
      }
    }

    return undefined;
  }
}
