import { EntityRepository, In, MoreThan, Repository } from 'typeorm';
import { AccountEntity } from '../entitiy/account.entity';
import { KycStatus } from '../../kyc/const/kyc.status';
import { KycEntity } from '../../kyc/entity/kyc.entity';

export interface IAmountOffsetFilters {
  amount?: number;
  offset?: number;
}

@EntityRepository(AccountEntity)
export class AccountRepository extends Repository<AccountEntity> {
  async blockDuplicateAccount(account: AccountEntity) {
    await this.createQueryBuilder()
      .update(AccountEntity)
      .set({
        isBlocked: true,
        blockingReason: 'DUPLICATE',
      })
      .where('id = :id', { id: account.id })
      .execute();
  }

  async linkAccounts(data: { mainAccountId: number, linkedAccountId: number }) {
    await this.createQueryBuilder()
      .update(AccountEntity)
      .set({
        mainAccount: {
          id: data.mainAccountId,
        },
      })
      .where('id = :id', { id: data.linkedAccountId })
      .execute();
  }

  findByEmail(email: string) {
    return this.findOne({ where: { email } });
  }

  async getAccountsOfCounterparty(counterpartySourceAccount: AccountEntity): Promise<AccountEntity[]> {
    const accountWithRelations = await this.findOne({
      where: {
        id: counterpartySourceAccount.id,
      },
      relations: [ 'counterpartyClients' ],
    });

    if (!accountWithRelations) {
      return [];
    }

    return accountWithRelations.counterpartyClients || [];
  }

  async getAccountsWithFilters(filters: IAmountOffsetFilters): Promise<AccountEntity[]> {
    return await this.find({
      skip: filters.offset,
      take: filters.amount,
    });
  }

  async getAccountsOfCounterpartyWithFilters(counterpartySourceAccount: AccountEntity, filters: IAmountOffsetFilters): Promise<AccountEntity[]> {
    const queryRaw = `
      SELECT "accountsId_2" AS "accountId" 
      FROM accounts_counterparty_clients_accounts 
      WHERE "accountsId_1" = $1 
      ORDER BY "accountId" ASC;`;

    const queryParams = [ counterpartySourceAccount.id ];

    const rows: { accountId: number }[] = await this.query(queryRaw, queryParams);
    const accountIds = rows.map(item => item.accountId);

    if (accountIds.length === 0) {
      return [];
    }

    return await this.find({
      where: {
        id: In(accountIds),
      },
      skip: filters.offset,
      take: filters.amount,
    });
  }

  async getAmountAccountsOfCounterparty(counterpartySourceAccount: AccountEntity): Promise<number> {
    const queryRaw = `SELECT * FROM accounts_counterparty_clients_accounts WHERE "accountsId_1" = $1;`;
    const queryParams = [ counterpartySourceAccount.id ];

    const result: any[] = await this.query(queryRaw, queryParams);
    return result.length;
  }

  async getAmountOfAccounts(): Promise<number> {
    return await this.count();
  }

  async addClientForCounterparty(params: { accountId: number, counterpartyId: number }) {
    const queryRaw = `
      INSERT INTO accounts_counterparty_clients_accounts ("accountsId_1", "accountsId_2")
      VALUES ( $1 , $2 )
      ON CONFLICT DO NOTHING`;

    const queryParams = [ params.counterpartyId, params.accountId ];
    await this.query(queryRaw, queryParams);
  }

  async accountCameFromCounterparty(params: { accountId: number, counterpartyId: number }): Promise<boolean> {
    const queryRaw = `
      SELECT * FROM accounts_counterparty_clients_accounts 
      WHERE "accountsId_1" = $1 AND "accountsId_2" = $2;`;

    const queryParams = [ params.counterpartyId, params.accountId ];

    const resultRaw: any[] = await this.query(queryRaw, queryParams);
    return resultRaw.length > 0;
  }

  // TODO: use later (uncomment)
  // async findAccountsWithoutCryptoWalletsAndWithApprovedKyc() {
  //   return await this.createQueryBuilder('accounts')
  //     .leftJoin(KycEntity, 'kyc', '"accounts"."id" = "kyc"."accountId"')
  //     .where(`(
  //                       ("btcWalletAddress" IS NULL) OR
  //                       ("ethWalletAddress" IS NULL) OR
  //                       ("ltcWalletAddress" IS NULL) OR
  //                       ("zcnWalletAddress" IS NULL) OR
  //
  //                       ("xrpWalletAddress" IS NULL) OR
  //                       ("bchWalletAddress" IS NULL) OR
  //                       ("xlmWalletAddress" IS NULL) OR
  //                       ("dashWalletAddress" IS NULL) OR
  //                       ("zecWalletAddress" IS NULL) OR
  //                       ("bsvWalletAddress" IS NULL) OR
  //                       ("btgWalletAddress" IS NULL)
  //                    )
  //                    AND
  //                    (
  //                       ("kyc"."status" NOT IN ('unapproved', 'tier1_pending', 'tier1_rejected')) AND
  //                       ("kyc"."status" NOTNULL)
  //                    )`, { })
  //     .getMany();
  // }

  async findAccountsWithoutCryptoWalletsAndWithApprovedKyc() {
    return await this.createQueryBuilder('accounts')
      .leftJoin(KycEntity, 'kyc', '"accounts"."id" = "kyc"."accountId"')
      .where(`(
                        ("btcWalletAddress" IS NULL) OR
                        ("ethWalletAddress" IS NULL) OR
                        ("ltcWalletAddress" IS NULL) OR
                        ("zcnWalletAddress" IS NULL)
                     ) 
                     AND 
                     (
                        ("kyc"."status" NOT IN ('unapproved', 'tier1_pending', 'tier1_rejected')) AND
                        ("kyc"."status" NOTNULL)                        
                     )`, { })
      .getMany();
  }

  getReferrals(accountId: number): Promise<AccountEntity[]> {
    return this.find({
      where: {
        refer: {
          id: accountId,
        },
      },
    });
  }

  async disablePartnerProgram(account: AccountEntity) {
    await this.createQueryBuilder()
      .update(AccountEntity)
      .set({
        isPartner: false,
        referralToken: null as any,
        exchangeCommissionCoefficient: null as any,
      })
      .where('id = :id', { id: account.id })
      .execute();
  }

  async releaseReferrals(account: AccountEntity) {
    await this.createQueryBuilder()
      .update(AccountEntity)
      .set({
        refer: null as any,
      })
      .where('refer.id = :id', { id: account.id })
      .execute();
  }

  findByReferralToken(referralToken: string) {
    return this.findOne({
      where: {
        referralToken,
      },
    });
  }

  findByBtcWallet(btcWalletAddress: string) {
    return this.findOne({
      where: { btcWalletAddress },
      relations: ['bankAccounts', 'cryptoWallets'],
    });
  }

  findByEthWallet(ethWalletAddress: string) {
    return this.findOne({
      where: { ethWalletAddress },
      relations: ['bankAccounts', 'cryptoWallets'],
    });
  }

  findByZcnWallet(zcnWalletAddress: string) {
    return this.findOne({
      where: { zcnWalletAddress },
      relations: ['bankAccounts', 'cryptoWallets'],
    });
  }

  findByLtcWallet(ltcWalletAddress: string) {
    return this.findOne({
      where: { ltcWalletAddress },
      relations: ['bankAccounts', 'cryptoWallets'],
    });
  }

  async getApprovedAccounts(): Promise<AccountEntity[]> {
    return this.find({
      where: {
        isActivated: true,
        kyc: {
          status: [ KycStatus.Tier1Approved, KycStatus.Tier2Approved, KycStatus.Tier3Approved ],
        },
      },
    });
  }

  async getAccountsByIds(accountIds: number[]): Promise<AccountEntity[]> {
    return this.find({
      where: {
        id: In(accountIds),
      },
    });
  }

  async getApprovedAccountsAddresses() {
    const accounts = await this.getApprovedAccounts();
    return accounts.map(account => ({
      btcAddress: account.btcWalletAddress,
      ethAddress: account.ethWalletAddress,
      ltcAddress: account.ltcWalletAddress,
      zcnAddress: account.zcnWalletAddress,

      xrpAddress: account.xrpWalletAddress,
      bchAddress: account.bchWalletAddress,
      xlmAddress: account.xlmWalletAddress,
      dashAddress: account.dashWalletAddress,
      zecAddress: account.zecWalletAddress,
      bsvAddress: account.bsvWalletAddress,
      btgAddress: account.btgWalletAddress,
    }));
  }

  public findByActivationToken(activationToken: string) {
    return this.findOne({ where: { activationToken, isActivated: false } });
  }

  public findByResetToken(resetToken: string) {
    return this.findOne( { where: { resetToken, resetTokenExpiration: MoreThan(new Date()) } });
  }

  public findByResetTokenForLogin(resetToken: string) {
    return this.findOne( { where: { resetToken, loginByResetTokenExpiration: MoreThan(new Date()) } });
  }

  public getAllAccountsShort() {
    return this.find();
  }

  public getAllAccountsFull() {
    return this.find({
      relations: ['bankAccounts', 'cryptoWallets'],
    });
  }

  public getAccountFull(accountId: number) {
    return this.findOne({
      where: {id: accountId},
      relations: ['bankAccounts', 'cryptoWallets'],
    });
  }

  getAccountById(accountId: number) {
    return this.getAccountFull(accountId);
  }
}