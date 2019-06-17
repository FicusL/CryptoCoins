import { EntityRepository, FindConditions, In, IsNull, MoreThan, Not, Repository } from 'typeorm';
import { KycEntity } from '../entity/kyc.entity';
import { KycStatus } from '../const/kyc.status';
import { IKycGetFilters } from '../abstract/kyc.get-filters.interface';
import { AccountEntity } from '../../account/entitiy/account.entity';
import { SumsubReviewStatuses } from '../sumsub/types/sumsub.review-statuses';

const kycRelations = [ 'account', 'lastEditBy' ];

@EntityRepository(KycEntity)
export class KycRepository extends Repository<KycEntity> {
  getKycForCheckingInSumsub(lastEditDateStart: Date) {
    return this.find({
      where: {
        sumSubApplicantId: Not(IsNull()),
        sumSubStatus: Not(In([
          SumsubReviewStatuses.completed,
          SumsubReviewStatuses.completedSent,
          SumsubReviewStatuses.completedSentFailure,
        ])),
        status: In([
          KycStatus.Unapproved,
          KycStatus.Tier1Pending,
        ]),
        lastEditDate: MoreThan(lastEditDateStart),
      },
    });
  }

  findKycBySumSubDocumentNumber(docNumber: string): Promise<KycEntity | undefined> {
    return this.findOne({
      where: {
        sumSubDocumentNumber: docNumber,
      },
    });
  }

  findBySumSubId(sumSubApplicantId: string): Promise<KycEntity | undefined> {
    return this.findOne({
      where: {
        sumSubApplicantId,
      } as FindConditions<KycEntity>,
      relations: kycRelations,
    });
  }

  findByAccount(account: AccountEntity): Promise<KycEntity | undefined> {
    return this.findOne({
      where: {
        account: {
          id: account.mainAccountId || account.id,
        },
      },
      relations: kycRelations,
    });
  }

  async findAccountIdToKycMap(accounts: AccountEntity[]): Promise<Map<number, KycEntity>> {
    const ids = accounts.map(account => account.mainAccountId || account.id);
    if (ids.length === 0) {
      return new Map();
    }

    const result = new Map<number, KycEntity>();
    const founded = await this.find({
      where: {
        account: {
          id: In(ids),
        },
      },
      relations: kycRelations,
    });

    founded.forEach(item => result.set(item.account.id, item));

    accounts.forEach(item => {
      if (!item.mainAccountId) {
        return;
      }

      const kyc = result.get(item.mainAccountId);
      if (!kyc) {
        return;
      }

      result.set(item.id, kyc);
    });

    return result;
  }

  async getWithFiltersWithRelations(filters: IKycGetFilters): Promise<KycEntity[]> {
    const findConditions: FindConditions<KycEntity> = { };

    if (filters.statuses) {
      if (filters.statuses.length > 0) {
        findConditions.status = In(filters.statuses);
      } else {
        // NOTE: if not use this code, TypeORM created incorrect query: SELECT * FROM WHERE "field" IN ()
        return [];
      }
    }

    return await this.find({
      where: {
        ...findConditions,
      },
      relations: kycRelations,
      skip: filters.offset,
      take: filters.amount,
      order: {
        id: 'DESC',
      },
    });
  }

  async getAmountEntities(filters: IKycGetFilters): Promise<number> {
    const findConditions: FindConditions<KycEntity> = { };

    if (filters.statuses) {
      if (filters.statuses.length > 0) {
        findConditions.status = In(filters.statuses);
      } else {
        return 0;
      }
    }

    return await this.count({
      where: {
        ...findConditions,
      },
    });
  }

  async getAllWithRelations(): Promise<KycEntity[]> {
    return await this.find({
      relations: kycRelations,
    });
  }

  async getAllPendingWithRelations(): Promise<KycEntity[]> {
    return await this.find({
      where: {
        status: KycStatus.Tier1Pending,
      },
      relations: kycRelations,
    });
  }

  async getAllFileNamesWithOutRejected(): Promise<string[]> {
    const allAccounts = await this.find();

    const selectedAccounts = allAccounts.filter(item => {
      return item.status !== KycStatus.Tier1Rejected &&
        item.status !== KycStatus.Tier2Rejected &&
        item.status !== KycStatus.Tier3Rejected;
    });

    return selectedAccounts.filter(item => !!item.fileName).map(item => item.fileName!);
  }
}