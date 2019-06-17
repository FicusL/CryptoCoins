import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigsService } from '../../core/service/configs.service';
import { TransactionService } from './transaction.service';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionRepository } from '../repository/transaction.repository';
import { waitMiliseconds } from '../../core/util/wait-ms';
import { TransactionEntity } from '../entity/transaction.entity';
import { TransactionStatus } from '../const/transaction.status.enum';

@Injectable()
export class TransactionExchangeRateUpdaterService implements OnApplicationBootstrap {
  // region Private Fields

  private static readonly IntervalBetweenTransactionFetching = 5 * 60 * 1000;
  private static readonly IntervalForUpdatingRate = 10 * 60 * 1000;
  private readonly transactionIdToTimeoutId = new Map<number, NodeJS.Timer>();

  // endregion

  constructor(
    @InjectRepository(TransactionRepository)
    private readonly transactionRepository: TransactionRepository,

    private readonly transactionService: TransactionService,
  ) { }

  onApplicationBootstrap() {
    if (ConfigsService.isMasterService) {
      this.startLoop();
    }
  }

  // region Private Methods

  private async startLoop() {
    while (true) {
      try {
        await this.loopIteration();
      } catch (e) {
        Logger.error(e.message, undefined, TransactionExchangeRateUpdaterService.name);
      }

      await waitMiliseconds(TransactionExchangeRateUpdaterService.IntervalBetweenTransactionFetching);
    }
  }

  private async loopIteration() {
    const transactions = await this.transactionRepository.findTransactionsForUpdateExchangeRate();

    const ids = transactions.map(transaction => transaction.id);
    const trackedIds: number[] = Array.from(this.transactionIdToTimeoutId.keys());

    const idsForStopTracking = trackedIds.filter(id => !ids.includes(id));
    for (const id of idsForStopTracking) {
      this.clearTimeoutForTransactionId(id);
    }

    const idsForStartTracking = ids.filter(id => !trackedIds.includes(id));
    const transactionsForStartTracking = transactions.filter(transaction => idsForStartTracking.includes(transaction.id));

    for (const transaction of transactionsForStartTracking) {
      this.startTracking(transaction);
    }
  }

  private clearTimeoutForTransactionId(transactionId: number) {
    const timeoutId = this.transactionIdToTimeoutId.get(transactionId);
    this.transactionIdToTimeoutId.delete(transactionId);

    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  }

  private getTimeoutForNextUpdate(transaction: TransactionEntity) {
    const creation = transaction.creation.date;
    const now = Date.now();
    const delta = now - creation.getTime();
    const intervalForUpdatingRate = TransactionExchangeRateUpdaterService.IntervalForUpdatingRate;

    return intervalForUpdatingRate - (delta % intervalForUpdatingRate);
  }

  private startTracking(transaction: TransactionEntity) {
    this.clearTimeoutForTransactionId(transaction.id);

    const timeout = this.getTimeoutForNextUpdate(transaction);
    const timeoutId = setTimeout(() => this.timeoutHandler(transaction.id), timeout);

    this.transactionIdToTimeoutId.set(transaction.id, timeoutId);
  }

  private async timeoutHandler(transactionId: number) {
    try {
      let transaction = await this.transactionRepository.getTransactionById(transactionId);
      if (!transaction) {
        this.clearTimeoutForTransactionId(transactionId);
        return;
      }

      const transactionMustBeUpdated =
        transaction.deposit.isActive &&
        !transaction.deposit.paid &&
        transaction.exchange.isActive &&
        transaction.status === TransactionStatus.Pending;

      if (!transactionMustBeUpdated) {
        this.clearTimeoutForTransactionId(transactionId);
        return;
      }

      transaction = await this.transactionService.updateExchangeRate(transaction);
      this.startTracking(transaction);
    } catch (e) {
      Logger.error(e.message, undefined, TransactionExchangeRateUpdaterService.name);
    }
  }

  // endregion
}