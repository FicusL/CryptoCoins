import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { CoreEmailService } from '../../../core/modules/email/core.email.service';
import { ConfigsService } from '../../../core/service/configs.service';
import { TransactionAddTransactionEvent } from '../impl/transaction.add-transaction.event';
import { TransactionType } from '../../const/transaction.type.enum';
import { TransactionStatus } from '../../const/transaction.status.enum';
import { IndexEntity } from '../../../index/entity/index.entity';
import { BigNumber } from 'bignumber.js';
import { IChangeIndexSupply } from '../../../index/types/change-index-supply.interface';
import { IndexService } from '../../../index/service/index.service';

@EventsHandler(TransactionAddTransactionEvent)
export class TransactionAddTransactionEventHandler implements IEventHandler<TransactionAddTransactionEvent> {
  constructor(
    protected readonly emailService: CoreEmailService,
    private readonly indexService: IndexService,
  ) { }

  async handle(event: TransactionAddTransactionEvent) {
    await Promise.all([
      this.sendPlainTextToZichange(event),
      this.handleIndexTransactions(event),
    ]);
  }

  // region private methods

  private async sendPlainTextToZichange(event: TransactionAddTransactionEvent) {
    const dateArray = event.transaction.creation.date.toISOString().split('T');
    const datePart = dateArray[0].split('-');
    const timePart = dateArray[1].split(':');

    const date = `${datePart[2]}.${datePart[1]}.${datePart[0]} ${timePart[0]}:${timePart[1]}`;

    try {
      await this.emailService.sendPlainText({
        to: ConfigsService.emailForNotifyAboutNewInformation,
        subject: 'ZiChange Transaction',
      }, [
        'You have new transaction.',
        '',
        `Date: ${date}`,
        `Client: ${event.account.email}`,
        `Type: ${event.transaction.type}`,
        `Reference ID: ${event.transaction.referenceId}`,
        `Status: ${event.transaction.status}`,
      ]);
    } catch (e) {
      Logger.error(e.message, undefined, TransactionAddTransactionEventHandler.name);
    }
  }

  private async handleIndexTransactions(event: TransactionAddTransactionEvent) {
    if (event.transaction.status !== TransactionStatus.Completed) {
      return;
    }

    try {
      const changeIndexSupply = await this.getChangeIndexSupply(event);
      if (!changeIndexSupply) {
        return;
      }

      await this.indexService.handleChangeIndexSupply(changeIndexSupply);
    } catch (e) {
      Logger.error(e.message, undefined, `${TransactionAddTransactionEventHandler.name}.${this.handleIndexTransactions.name}`);
    }
  }

  private async getChangeIndexSupply(event: TransactionAddTransactionEvent): Promise<IChangeIndexSupply | undefined> {
    let index: undefined | IndexEntity;
    let oldSupply: undefined | BigNumber;
    let newSupply: undefined | BigNumber;

    if (event.transaction.type === TransactionType.ManagementFee) {
      index = await this.indexService.getIndexByTicker(event.transaction.fee.currency);
      oldSupply = index.supply;
      newSupply = oldSupply.minus(event.transaction.fee.amount);

    } else if (event.transaction.type === TransactionType.BuyBasket) {
      index = await this.indexService.getIndexByTicker(event.transaction.exchange.to.currency);
      oldSupply = index.supply;
      newSupply = oldSupply.plus(event.transaction.exchange.to.amount);

    } else if (event.transaction.type === TransactionType.SellBasket) {
      index = await this.indexService.getIndexByTicker(event.transaction.exchange.from.currency);
      oldSupply = index.supply;
      newSupply = oldSupply.minus(event.transaction.exchange.from.amount);
    }

    if (!index || !newSupply || !oldSupply) {
      return undefined;
    }

    return { index, newSupply, oldSupply };
  }

  // endregion
}