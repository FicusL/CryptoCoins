import { BigNumber } from 'bignumber.js';
import { getLinkedAccountIds } from '../../account/repository/account.repository-utils';
import { Injectable } from '@nestjs/common';
import { TransactionStatus } from '../../transaction/const/transaction.status.enum';
import { Connection } from 'typeorm';
import { CoinType } from '../../core/const/coins';

@Injectable()
export class BalanceRepository {
  // region Public methods

  constructor(
    private readonly connection: Connection,
  ) { }

  async getBalances(): Promise<IBalancesRow[]> {
    const params = [
      TransactionStatus.Completed, // $1
      TransactionStatus.Rejected, // $2
      TransactionStatus.Referral, // $3
      TransactionStatus.PaymentFailed, // $4
    ];
    const query = `
      SELECT SUM("amount") AS "amount", "currency", "accountId" FROM (
        SELECT "currency", "amount", COALESCE("accounts"."mainAccountId", "accountId") AS "accountId" FROM (
          SELECT SUM("amount") AS "amount", "currency", "accountId" FROM (
            -- Deposit part
            
            SELECT +SUM("depositAmount") AS "amount", "depositCurrency" AS "currency", "accountId"
            FROM "transactions"
            WHERE "status" = $1 AND "depositIsactive" AND "depositCurrency" IS NOT NULL
            GROUP BY "depositCurrency", "accountId"
            UNION ALL
            
            SELECT -SUM("depositFeeAmount") AS "amount", "depositFeeCurrency" AS "currency", "accountId"
            FROM "transactions"
            WHERE "status" = $1 AND "depositIsactive" AND "depositFeeCurrency" IS NOT NULL
            GROUP BY "depositFeeCurrency", "accountId"
            UNION ALL
            
            -- Exchange part
            
            SELECT -SUM("exchangeFromAmount") AS "amount", "exchangeFromCurrency" AS "currency", "accountId"
            FROM "transactions"
            WHERE (("status" NOT IN ($2, $4)) AND NOT ("counterpartyId" IS NOT NULL AND "status" != $1)) 
              AND "exchangeIsactive" AND "exchangeFromCurrency" IS NOT NULL
            GROUP BY "exchangeFromCurrency", "accountId"
            UNION ALL
            
            SELECT +SUM("exchangeToAmount") AS "amount", "exchangeToCurrency" AS "currency", "accountId"
            FROM "transactions"
            WHERE (("status" = $1 AND "withdrawalIsactive" != true) OR ("status" NOT IN ($2, $4) AND "withdrawalIsactive" = true)) 
              AND "exchangeIsactive" AND "exchangeToCurrency" IS NOT NULL
            GROUP BY "exchangeToCurrency", "accountId"
            UNION ALL
            
            -- Withdrawal part
            
            SELECT -SUM("withdrawalAmount") AS "amount", "withdrawalCurrency" AS "currency", "accountId"
            FROM "transactions"
            WHERE "status" NOT IN ($2, $4) AND "withdrawalIsactive" AND "withdrawalCurrency" IS NOT NULL
            GROUP BY "withdrawalCurrency", "accountId"
            UNION ALL
            
            -- Fee part
            
            SELECT -SUM("feeAmount") AS "amount", "feeCurrency" AS "currency", "accountId"
            FROM "transactions"
            WHERE "status" = $1 AND "feeIsactive" AND "feeCurrency" IS NOT NULL
            GROUP BY "feeCurrency", "accountId"
            UNION ALL
            
            -- Referral part
            
            SELECT +SUM("referralDataAmount") AS "amount", "referralDataCurrency" AS "currency", "accountId"
            FROM "transactions"
            WHERE "status" = $3 AND "referralDataCurrency" IS NOT NULL
            GROUP BY "referralDataCurrency", "accountId"
            UNION ALL
            
            -- Counterparty fee part
            
            SELECT +SUM("counterpartyFee") AS "amount", "exchangeFromCurrency" AS "currency", "counterpartyId" AS "accountId"
            FROM "transactions"
            WHERE "status" = $1 AND "exchangeFromCurrency" IS NOT NULL AND "counterpartyId" IS NOT NULL
            GROUP BY "exchangeFromCurrency", "counterpartyId"
            
          ) as "total"
          GROUP BY "currency", "accountId"
        ) AS "balances"
        LEFT JOIN "accounts"
        ON "accounts"."id" = "balances"."accountId"
      ) as "final_table"
      GROUP BY "currency", "accountId";
    `;
    const resultRaw: IBalancesQueryRow[] = await this.connection.query(query, params);
    return resultRaw.map(item => ({
      amount: new BigNumber(item.amount),
      currency: item.currency,
      accountId: +item.accountId,
    }));
  }

  async getCurrenciesBalances(accountId: number): Promise<Map<string, BigNumber>> {
    // Note: read README.md about balances calculating

    const getQueryPart = this.getBalanceRawQueryPart;

    const ids = await getLinkedAccountIds(this.connection, accountId);
    if (ids.length === 0) {
      return new Map();
    }

    // TODO: think about it
    const accountIdsLine = ids.join(',');

    const params = [
      TransactionStatus.Completed, // $1
      TransactionStatus.Rejected, // $2
      TransactionStatus.Referral, // $3
      TransactionStatus.PaymentFailed, // $4
    ];
    const query = `
      SELECT SUM("amount") as "amount", "currency" FROM (
        -- Deposit part
        ${getQueryPart(accountIdsLine, '+', 'depositAmount', 'depositCurrency', 'depositIsactive', '"status" = $1')} UNION ALL
        ${getQueryPart(accountIdsLine, '-', 'depositFeeAmount', 'depositFeeCurrency', 'depositIsactive', '"status" = $1')} UNION ALL
      
        -- Exchange part
        ${getQueryPart(accountIdsLine, '-', 'exchangeFromAmount', 'exchangeFromCurrency', 'exchangeIsactive',
      '(("status" NOT IN ($2, $4)) AND NOT ("counterpartyId" IS NOT NULL AND "status" != $1))')} UNION ALL
        ${getQueryPart(accountIdsLine, '+', 'exchangeToAmount', 'exchangeToCurrency', 'exchangeIsactive',
      '(("status" = $1 AND "withdrawalIsactive" != true) OR ("status" NOT IN ($2, $4) AND "withdrawalIsactive" = true))',
    )} UNION ALL
        
        -- Withdrawal part
        ${getQueryPart(accountIdsLine, '-', 'withdrawalAmount', 'withdrawalCurrency', 'withdrawalIsactive', '"status" NOT IN ($2, $4)')} UNION ALL
        
        -- Fee part
        ${getQueryPart(accountIdsLine, '-', 'feeAmount', 'feeCurrency', 'feeIsactive', '"status" = $1')} UNION ALL
            
        -- Referral part
        ${this.getBalanceRawQueryPartForReferral(accountIdsLine)} UNION ALL
        
        -- Counterparty fee part
        ${this.getBalanceRawQueryPartForCounterparty(accountIdsLine)}
        
        ) as "total" GROUP BY "currency";`;

    const resultRaw: IAccountBalancesQueryRow[] = await this.connection.query(query, params);

    const result = new Map<string, BigNumber>();
    for (const row of resultRaw) {
      result.set(row.currency, new BigNumber(row.amount));
    }

    return result;
  }

  async getCurrencyBalance(accountId: number, currency: CoinType): Promise<BigNumber> {
    const balances = await this.getCurrenciesBalances(accountId);
    return balances.get(currency) || new BigNumber('0');
  }

  // endregion

  // region Private methods

  private getBalanceRawQueryPart(
    accountIdsLine: string, sign: '+' | '-', amountField: string, currencyField: string, activeField: string, statusStatement: string,
  ) {
    return ` 
      SELECT ${sign}SUM("${amountField}") AS "amount", "${currencyField}" AS "currency"
        FROM "transactions"
        WHERE "accountId" IN (${accountIdsLine}) AND ${statusStatement} AND "${activeField}" AND "${currencyField}" IS NOT NULL
        GROUP BY "${currencyField}"
     `;
  }

  private getBalanceRawQueryPartForReferral(accountIdsLine: string) {
    const currencyField = 'referralDataCurrency';

    return ` 
      SELECT +SUM("referralDataAmount") AS "amount", "${currencyField}" AS "currency"
        FROM "transactions"
        WHERE "accountId" IN (${accountIdsLine}) AND "status" = $3 AND "${currencyField}" IS NOT NULL
        GROUP BY "${currencyField}"
     `;
  }

  private getBalanceRawQueryPartForCounterparty(accountIdsLine: string) {
    const currencyField = 'exchangeFromCurrency';

    return ` 
      SELECT +SUM("counterpartyFee") AS "amount", "${currencyField}" AS "currency"
        FROM "transactions"
        WHERE "counterpartyId" IN (${accountIdsLine}) AND "status" = $1 AND "${currencyField}" IS NOT NULL AND "counterpartyId" IS NOT NULL
        GROUP BY "${currencyField}"
     `;
  }

  // endregion
}

// region Help types

interface IAccountBalancesQueryRow {
  amount: string;
  currency: string;
}

interface IBalancesQueryRow {
  amount: string;
  currency: string;
  accountId: string;
}

interface IBalancesRow {
  amount: BigNumber;
  currency: string;
  accountId: number;
}

// endregion