import { Between, EntityRepository, FindConditions, In, Not, Repository } from 'typeorm';
import { TransactionEntity } from '../entity/transaction.entity';
import { TransactionSortDirection } from '../../realtime/const/transaction/transaction.sort.direction.enum';
import { ITransactionGetFilters } from '../abstract/transaction.get.filters.interface';
import { TransactionSortBy } from '../../realtime/const/transaction/transaction.sort.by.enum';
import { TransactionType } from '../const/transaction.type.enum';
import { BigNumber } from 'bignumber.js';
import { AccountEntity } from '../../account/entitiy/account.entity';
import { TransactionStatus } from '../const/transaction.status.enum';
import { getLinkedAccountIds } from '../../account/repository/account.repository-utils';

@EntityRepository(TransactionEntity)
export class TransactionRepository extends Repository<TransactionEntity> {
  protected handleBeforeSave(transaction: TransactionEntity) {
    // without this code TypeORM set this field to null

    if (transaction.creation) {
      // @ts-ignore
      const creationAccountId: any = transaction.creation.creationAccount;

      if (typeof creationAccountId === 'number') {
        transaction.creation.creationAccount = { id: creationAccountId } as any;
        transaction.creation.creationAccountId = creationAccountId;
      }
    }

    // NOTE: for edit account work ok
  }

  async correctSaveArray(transactions: TransactionEntity[]): Promise<TransactionEntity[]> {
    for (const transaction of transactions) {
      this.handleBeforeSave(transaction);
    }

    return await this.save(transactions);
  }

  async correctSave(transaction: TransactionEntity): Promise<TransactionEntity> {
    this.handleBeforeSave(transaction);
    return await this.save(transaction);
  }

  async findTransactionsForUpdateExchangeRate(): Promise<TransactionEntity[]> {
    return this.find({
      where: {
        deposit: {
          isActive: true,
          paid: false,
        },
        exchange: {
          isActive: true,
        },
        status: TransactionStatus.Pending,
      },
      relations: transactionRelations,
      loadRelationIds: transactionLoadRelationIds,
    });
  }

  async findByAccountId(accountId: number, options: IFindOptions): Promise<TransactionEntity[]> {
    const ids = await getLinkedAccountIds(this.manager.connection, accountId);
    if (ids.length === 0) {
      return [];
    }

    const { sort, offset, amount } = options;

    let queryBuilder = this.createQueryBuilder()
      .where({
        account: {
          id: In(ids),
        },
        type: Not(In([ TransactionType.Referral ])),
      });

    if (amount && amount > 0) {
      queryBuilder = queryBuilder.limit(amount);
    }

    // TODO: add relations for withdrawal method
    return queryBuilder
      .offset(offset || 0)
      .orderBy(`id`, sort.direction || TransactionSortDirection.DESC)
      // .addOrderBy(`${sort.by || TransactionSortBy.date}`, sort.direction || TransactionSortDirection.DESC)
      .getMany();
  }

  async findReferralTransactionsByAccountId(accountId: number): Promise<TransactionEntity[]> {
    const ids = await getLinkedAccountIds(this.manager.connection, accountId);
    if (ids.length === 0) {
      return [];
    }

    return this.createQueryBuilder()
      .where({
        account: {
          id: In(ids),
        },
        type: TransactionType.Referral,
      })
      .orderBy(`id`, TransactionSortDirection.DESC)
      .getMany();
  }

  protected async getFindConditions(filters: ITransactionGetFilters): Promise<FindConditions<TransactionEntity>> {
    const findConditions: FindConditions<TransactionEntity> = { };

    if (filters.status) {
      findConditions.status = filters.status;
    }

    if (filters.type) {
      findConditions.type = filters.type;
    }

    if (filters.account) {
      const ids = await getLinkedAccountIds(this.manager.connection, filters.account.id);
      if (ids.length === 0) {
        ids.push(filters.account.id);
      }

      findConditions.account = {
        id: In(ids),
      };
    }

    if (filters.counterparty) {
      const ids = await getLinkedAccountIds(this.manager.connection, filters.counterparty.id);
      if (ids.length === 0) {
        ids.push(filters.counterparty.id);
      }

      findConditions.counterparty = {
        id: In(ids),
      };
    }

    const beginDate = filters.beginDate || new Date('2000.01.01');
    const endDate = filters.endDate || new Date();

    findConditions.creation = {
      date: Between(beginDate, endDate),
    };

    return findConditions;
  }

  async getAllTransactionWithFilters(filters: ITransactionGetFilters): Promise<TransactionEntity[]> {
    const findConditions = await this.getFindConditions(filters);

    return await this.find({
      where: {
        ...findConditions,
      },
      relations: transactionRelations,
      loadRelationIds: transactionLoadRelationIds,
      skip: filters.offset,
      take: filters.amount,
      order: {
        id: 'DESC',
      },
    });
  }

  async getAmountEntities(filters: ITransactionGetFilters): Promise<number> {
    const findConditions = await this.getFindConditions(filters);

    return await this.count({
      where: {
        ...findConditions,
      },
    });
  }

  async findByAccountsIds(accountIds: number[], filters: ITransactionGetFilters): Promise<TransactionEntity[]> {
    if (accountIds.length === 0) {
      return [];
    }

    const findConditions = await this.getFindConditions(filters);
    findConditions.account = { id: In(accountIds) };

    return await this.find({
      where: {
        ...findConditions,
      },
      relations: transactionRelations,
      loadRelationIds: transactionLoadRelationIds,
      skip: filters.offset,
      take: filters.amount,
      order: {
        id: 'DESC',
      },
    });
  }

  async getAmountEntitiesForAccounts(accountIds: number[], filters: ITransactionGetFilters): Promise<number> {
    if (accountIds.length === 0) {
      return 0;
    }

    const findConditions = await this.getFindConditions(filters);
    findConditions.account = { id: In(accountIds) };

    return await this.count({
      where: {
        ...findConditions,
      },
    });
  }

  async getTransactionsInfo(accounts: AccountEntity[], additionalWhere?: FindConditions<TransactionEntity>): Promise<ICounterpartyTransactionInfo[]> {
    if (accounts.length === 0) {
      return [];
    }

    const accountIdToAccount = new Map<number, AccountEntity>();
    accounts.forEach(account => accountIdToAccount.set(account.id, account));

    const accountIds = accounts.map(account => account.id);

    const resultRaw: { fee: string, deposit: string, accountId: number }[] = await this.createQueryBuilder('transaction')
      .select(`COALESCE(SUM(COALESCE("counterpartyFeeEUREquivalent", 0)), 0)`, 'fee')
      .addSelect('COALESCE(SUM(COALESCE("depositExternaleurequivalent", 0)), 0)', 'deposit')
      .addSelect('"transaction"."accountId"', 'accountId')
      .groupBy('"transaction"."accountId"')
      .where({
        status: TransactionStatus.Completed,
        account: {
          id: In(accountIds),
        },
        ...additionalWhere,
      })
      .getRawMany();

    return resultRaw.map(item => ({
      account: accountIdToAccount.get(item.accountId)!,
      transactionsEurAmount: new BigNumber(item.deposit),
      feesEurAmount: new BigNumber(item.fee),
    }));
  }

  async getCounterpartyTransactionsInfo(counterpartyAccount: AccountEntity, accounts: AccountEntity[]): Promise<ICounterpartyTransactionInfo[]> {
    const counterpartyIds = await getLinkedAccountIds(this.manager.connection, counterpartyAccount.id);
    if (counterpartyIds.length === 0) {
      return [];
    }

    return await this.getTransactionsInfo(accounts, {
      counterparty: {
        id: In(counterpartyIds),
      },
    });
  }

  async getBalanceFromFees(counterpartyAccount: AccountEntity): Promise<{ currency: string, balance: BigNumber }[]> {
    const ids = await getLinkedAccountIds(this.manager.connection, counterpartyAccount.id);
    if (ids.length === 0) {
      return [];
    }

    const resultRaw: { balance: string, currency: string }[] = await this.createQueryBuilder('transaction')
      .select(`SUM(COALESCE("counterpartyFee", 0))`, 'balance')
      .addSelect('"transaction"."depositCurrency"', 'currency')
      .groupBy('"transaction"."depositCurrency"')
      .where({
        status: TransactionStatus.Completed,
        counterparty: {
          id: In(ids),
        },
      })
      .getRawMany();

    return resultRaw.map(item => ({
      currency: item.currency,
      balance: new BigNumber(item.balance),
    }));
  }

  async findByCounterpartyActivationToken(token: string): Promise<TransactionEntity | undefined> {
    const where: FindConditions<TransactionEntity> = {
      counterpartyActivationToken: token,
    };

    return await this.findOne({ where });
  }

  async findByCryptoWalletId(cryptoWalletId: number): Promise<TransactionEntity[]> {
    return this.find({
      where: {
        withdrawal: {
          method: {
            cryptoWallet: {
              id: cryptoWalletId,
            },
          },
        },
      },
      relations: transactionRelations,
      loadRelationIds: transactionLoadRelationIds,
    });
  }

  async findByBankAccountId(bankAccountId: number): Promise<TransactionEntity[]> {
    return this.find({
      where: {
        withdrawal: {
          method: {
            bankAccount: {
              id: bankAccountId,
            },
          },
        },
      },
      relations: transactionRelations,
      loadRelationIds: transactionLoadRelationIds,
    });
  }

  async removeCryptoWalletFromTransactions(cryptoWalletId: number) {
    await this.query(`
      UPDATE transactions 
      SET "cryptoWalletId" = NULL
      WHERE "cryptoWalletId" = $1
    `, [ cryptoWalletId ]);
  }

  async removeBankAccountFromTransactions(bankAccountId: number) {
    await this.query(`
      UPDATE transactions 
      SET "bankAccountId" = NULL
      WHERE "bankAccountId" = $1
    `, [ bankAccountId ]);
  }

  async getTransactionById(transactionId: number): Promise<TransactionEntity|undefined> {
    return await this.findOne({
      where: { id: transactionId },
      relations: transactionRelations,
      loadRelationIds: transactionLoadRelationIds,
    });
  }
}

// region Additional Types And Constants

export interface ICounterpartyTransactionInfo {
  account: AccountEntity;
  transactionsEurAmount: BigNumber;
  feesEurAmount: BigNumber;
}

const transactionRelations = [
  'withdrawal.method.cryptoWallet',
  'withdrawal.method.bankAccount',
  // 'creation.creationAccount',
  // 'edit.editAccount',
];

const transactionLoadRelationIds = {
  relations: [
    'creation.creationAccount',
    'edit.editAccount',
  ],
};

interface IFindOptions {
  sort: {
    by: TransactionSortBy;
    direction: TransactionSortDirection;
  };
  offset?: number;
  amount?: number;
}

// endregion