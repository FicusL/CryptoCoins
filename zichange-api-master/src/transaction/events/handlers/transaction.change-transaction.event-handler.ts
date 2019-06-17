import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TransactionChangeTransactionEvent } from '../impl/transaction.change-transaction.event';
import { TransactionType } from '../../const/transaction.type.enum';
import { Logger } from '@nestjs/common';
import { IndexService } from '../../../index/service/index.service';
import { TransactionStatus } from '../../const/transaction.status.enum';
import { BigNumber } from 'bignumber.js';
import { IndexEntity } from '../../../index/entity/index.entity';
import { IChangeIndexSupply } from '../../../index/types/change-index-supply.interface';

@EventsHandler(TransactionChangeTransactionEvent)
export class TransactionChangeTransactionEventHandler implements IEventHandler<TransactionChangeTransactionEvent> {
  constructor(
    private readonly indexService: IndexService,
  ) { }

  async handle(event: TransactionChangeTransactionEvent) {
    try {
      await this.handleIndexDataChanging(event);
    } catch (e) {
      Logger.error(e.message, undefined, `${TransactionChangeTransactionEventHandler.name}.${this.handle.name}`);
    }
  }

  // region Private methods

  private unCompleteToComplete(event: TransactionChangeTransactionEvent): boolean {
    return event.oldTransaction.status !== TransactionStatus.Completed &&
           event.newTransaction.status === TransactionStatus.Completed;
  }

  private completeToUnComplete(event: TransactionChangeTransactionEvent): boolean {
    return event.oldTransaction.status === TransactionStatus.Completed &&
           event.newTransaction.status !== TransactionStatus.Completed;
  }

  private async getChangeIndexSupply(event: TransactionChangeTransactionEvent): Promise<IChangeIndexSupply | undefined> {
    let index: undefined | IndexEntity;
    let oldSupply: undefined | BigNumber;
    let newSupply: undefined | BigNumber;

    if (event.oldTransaction.type === TransactionType.ManagementFee) {
      index = await this.indexService.getIndexByTicker(event.oldTransaction.fee.currency);
      oldSupply = index.supply;

      if (this.unCompleteToComplete(event)) {
        newSupply = oldSupply.minus(event.oldTransaction.fee.amount);
      }

      if (this.completeToUnComplete(event)) {
        newSupply = oldSupply.plus(event.oldTransaction.fee.amount);
      }

    } else if (event.oldTransaction.type === TransactionType.BuyBasket) {
      index = await this.indexService.getIndexByTicker(event.oldTransaction.exchange.to.currency);
      oldSupply = index.supply;

      if (this.unCompleteToComplete(event)) {
        newSupply = oldSupply.plus(event.oldTransaction.exchange.to.amount);
      }

      if (this.completeToUnComplete(event)) {
        newSupply = oldSupply.minus(event.oldTransaction.exchange.to.amount);
      }

    } else if (event.oldTransaction.type === TransactionType.SellBasket) {
      index = await this.indexService.getIndexByTicker(event.oldTransaction.exchange.from.currency);
      oldSupply = index.supply;

      if (this.unCompleteToComplete(event)) {
        newSupply = oldSupply.minus(event.oldTransaction.exchange.from.amount);
      }

      if (this.completeToUnComplete(event)) {
        newSupply = oldSupply.plus(event.oldTransaction.exchange.from.amount);
      }
    }

    if (!index || !newSupply || !oldSupply) {
      return undefined;
    }

    return { index, newSupply, oldSupply };
  }

  private async handleIndexDataChanging(event: TransactionChangeTransactionEvent) {
    const changeIndexSupply = await this.getChangeIndexSupply(event);
    if (!changeIndexSupply) {
      return;
    }

    await this.indexService.handleChangeIndexSupply(changeIndexSupply);
  }

  // endregion
}