import { EntityRepository, In, MoreThan, Not, Repository } from 'typeorm';
import { TransactionEntity } from '../entity/transaction.entity';
import { AccountEntity } from '../../account/entitiy/account.entity';
import { BigNumber } from 'bignumber.js';
import { TransactionStatus } from '../const/transaction.status.enum';
import { getLinkedAccountIds, getLinkedAccountIdsMap } from '../../account/repository/account.repository-utils';

@EntityRepository(TransactionEntity)
export class TransactionEUREquivalentRepository extends Repository<TransactionEntity> {
  // noinspection SpellCheckingInspection
  protected static readonly DEPOSIT_EXTERNAL_EUR_REQUIVALENT_FIELD = 'depositExternaleurequivalent';

  // noinspection SpellCheckingInspection
  protected static readonly WITHDRAWAL_EXTERNAL_EUR_REQUIVALENT_FIELD = 'withdrawalExternaleurequivalent';

  async getDepositEUREquivalentYTD(account: AccountEntity): Promise<BigNumber> {
    return this.getEUREquivalentYTD(account, TransactionEUREquivalentRepository.DEPOSIT_EXTERNAL_EUR_REQUIVALENT_FIELD);
  }

  async getDepositEUREquivalentYTDForAccounts(accounts: AccountEntity[]): Promise<IEUREquivalent[]> {
    return this.getEUREquivalentYTDForAccounts(accounts, TransactionEUREquivalentRepository.DEPOSIT_EXTERNAL_EUR_REQUIVALENT_FIELD);
  }

  async getWithdrawalEUREquivalentYTD(account: AccountEntity): Promise<BigNumber> {
    return this.getEUREquivalentYTD(account, TransactionEUREquivalentRepository.WITHDRAWAL_EXTERNAL_EUR_REQUIVALENT_FIELD);
  }

  protected async getEUREquivalentYTD(account: AccountEntity, fieldName: string): Promise<BigNumber> {
    const ids = await getLinkedAccountIds(this.manager.connection, account.id);
    if (ids.length === 0) {
      return new BigNumber(0);
    }

    const YTDDate = new Date();
    YTDDate.setFullYear(YTDDate.getFullYear() - 1);

    const resultRaw = await this.createQueryBuilder('transaction')
      .select(`SUM(COALESCE("${fieldName}", 0))`, 'data')
      .where({
        status: Not(In([ TransactionStatus.Rejected, TransactionStatus.PaymentFailed ])),
        account: {
          id: In(ids),
        },
        creation: {
          date: MoreThan(YTDDate),
        },
      })
      .getRawOne();

    return new BigNumber(resultRaw.data || 0);
  }

  protected async getEUREquivalentYTDForAccounts(accounts: AccountEntity[], fieldName: string): Promise<IEUREquivalent[]> {
    if (accounts.length === 0) {
      return [];
    }

    const accountIds = accounts.map(account => account.id);
    const accountsIdsSet = new Set<number>(accountIds);
    const linkedMap = await getLinkedAccountIdsMap(this.manager.connection, accountIds);
    const allAccountIds = this.getAllIds(linkedMap);
    const linkedToMain = this.getLinkedToMainMap(linkedMap);

    const accountIdToAccount = new Map<number, AccountEntity>();
    accounts.forEach(account => accountIdToAccount.set(account.id, account));

    const YTDDate = new Date();
    YTDDate.setFullYear(YTDDate.getFullYear() - 1);

    const resultRaw: { data: string, accountId: number }[] = await this.createQueryBuilder('transaction')
      .select(`SUM(COALESCE("${fieldName}", 0))`, 'data')
      .addSelect(`"transaction"."accountId"`, 'accountId')
      .groupBy('"transaction"."accountId"')
      .where({
        status: Not(In([ TransactionStatus.Rejected, TransactionStatus.PaymentFailed ])),
        account: {
          id: In(allAccountIds),
        },
        creation: {
          date: MoreThan(YTDDate),
        },
      })
      .getRawMany();

    const resultAccountIdToAmount = new Map<number, BigNumber>();

    resultRaw.forEach(item => {
      const linked = linkedMap.get(linkedToMain.get(item.accountId)!);
      if (!linked) {
        return;
      }

      linked.forEach(value => {
        const founded = resultAccountIdToAmount.get(value) || new BigNumber(0);
        resultAccountIdToAmount.set(value, founded.plus(item.data));
      });
    });

    const result: IEUREquivalent[] = [];
    const usedAccountIds = new Set<number>();

    resultAccountIdToAmount.forEach((value, accountId) => {
      usedAccountIds.add(accountId);

      if (accountsIdsSet.has(accountId)) {
        result.push({
          account: accountIdToAccount.get(accountId)!,
          equivalent: value,
        });
      }
    });

    for (const account of accounts) {
      if (!usedAccountIds.has(account.id)) {
        result.push({ account, equivalent: new BigNumber(0) });
      }
    }

    return result;
  }

  protected getAllIds(data: Map<number, Set<number>>): number[] {
    const result = new Set<number>();

    data.forEach((value, key) => {
      result.add(key);
      Array.from(value).forEach(item => result.add(item));
    });

    return Array.from(result);
  }

  protected getLinkedToMainMap(data: Map<number, Set<number>>): Map<number, number> {
    const result = new Map<number, number>();

    data.forEach((value, key) => {
      result.set(key, key);
      Array.from(value).forEach(item => result.set(item, key));
    });

    return result;
  }
}

interface IEUREquivalent {
  account: AccountEntity;
  equivalent: BigNumber;
}