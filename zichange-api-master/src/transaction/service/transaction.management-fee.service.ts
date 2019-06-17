import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { CronJob } from 'cron';
import { IndexService } from '../../index/service/index.service';
import { BalanceRepository } from '../../balance/service/balance.repository';
import { IndexEntity } from '../../index/entity/index.entity';
import { BigNumber } from 'bignumber.js';
import { AccountService } from '../../account/service/account.service';
import { TransactionEntity } from '../entity/transaction.entity';
import { TransactionStatus } from '../const/transaction.status.enum';
import { TransactionCreationEmbedded } from '../entity/embedded/transaction.creation.embedded';
import { TransactionLastEditEmbedded } from '../entity/embedded/transaction.last-edit.embedded';
import { TransactionAddTransactionEvent } from '../events/impl/transaction.add-transaction.event';
import { TransactionFeeEmbedded } from '../entity/embedded/transaction-parts/transaction.fee.embedded';
import { TransactionType } from '../const/transaction.type.enum';
import { TransactionRepository } from '../repository/transaction.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { EventBus } from '@nestjs/cqrs';
import { IndexRatesService } from '../../index/service/index.rates.service';
import { getMidnight } from '../../core/util/date-utils';

@Injectable()
export class TransactionManagementFeeService implements OnApplicationBootstrap {
  constructor(
    private readonly eventBus: EventBus,

    private readonly accountService: AccountService,
    private readonly indexService: IndexService,
    private readonly indexRatesService: IndexRatesService,
    private readonly balanceRepository: BalanceRepository,

    @InjectRepository(TransactionRepository)
    private readonly transactionRepository: TransactionRepository,
  ) { }

  onApplicationBootstrap() {
    new CronJob('0 0 0 * * *', () => this.cronHandler());
  }

  // region Private methods

  private async cronHandler() {
    try {
      const indexes = await this.indexService.getAllIndexes();
      const tickerToIndex = new Map<string, IndexEntity>();
      indexes.forEach(index => tickerToIndex.set(index.ticker, index));

      const balances = await this.balanceRepository.getBalances();
      const balancesForHandling = balances.filter(item => tickerToIndex.has(item.currency));

      for (const item of balancesForHandling) {
        await this.handleRow(item.accountId, tickerToIndex.get(item.currency)!, item.amount);
      }
    } catch (e) {
      Logger.error(e.message, undefined, `${TransactionManagementFeeService.name}.${this.cronHandler.name}`);
    }
  }

  private async handleRow(accountId: number, index: IndexEntity, balance: BigNumber) {
    try {
      if (balance.isLessThanOrEqualTo('0')) {
        return;
      }

      const account = await this.accountService.getAccountById(accountId);
      const coefficient = (new BigNumber('0.02')).dividedBy('365');
      const amount = balance.multipliedBy(coefficient);

      const externalEUREquivalent = this.indexRatesService.getEUREquivalent(index, amount);

      let transaction = new TransactionEntity({
        type: TransactionType.ManagementFee,
        status: TransactionStatus.Completed,
        creation: new TransactionCreationEmbedded({
          creationAccount: account,
          date: getMidnight(),
        }),
        edit: new TransactionLastEditEmbedded({
          date: new Date(0),
        }),
        account,
        fee: new TransactionFeeEmbedded({
          amount,
          currency: index.ticker,
          externalEUREquivalent,
          isActive: true,
        }),
      });

      transaction = await this.transactionRepository.correctSave(transaction);

      this.eventBus.publish(new TransactionAddTransactionEvent({
        account,
        transaction,
        pushToRedis: true,
      }));
    } catch (e) {
      Logger.error(e.message, undefined, `${TransactionManagementFeeService.name}.${this.handleRow.name}`);
    }
  }

  // endregion
}