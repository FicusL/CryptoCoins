import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TransactionEntity } from '../../entity/transaction.entity';
import { TransactionStatus } from '../../const/transaction.status.enum';
import { TransactionCreationEmbedded } from '../../entity/embedded/transaction.creation.embedded';
import { TransactionLastEditEmbedded } from '../../entity/embedded/transaction.last-edit.embedded';
import { AccountService } from '../../../account/service/account.service';
import { TransactionType } from '../../const/transaction.type.enum';
import { TransactionReferralEmbedded } from '../../entity/embedded/transaction-parts/transaction.referral.embedded';
import { TransactionRepository } from '../../repository/transaction.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionAddTransactionEvent } from '../../events/impl/transaction.add-transaction.event';
import { EventBus } from '@nestjs/cqrs';

@Injectable()
export class TransactionReferralPartService {
  constructor(
    private readonly eventBus: EventBus,

    @InjectRepository(TransactionRepository)
    private readonly transactionRepository: TransactionRepository,

    private readonly accountService: AccountService,
  ) { }

  async createReferralTransaction(referralTransaction: TransactionEntity): Promise<TransactionEntity | undefined> {
    const createReferralTransaction =
      referralTransaction.status === TransactionStatus.Completed &&
      referralTransaction.exchange.isActive;

    const referral = await this.accountService.getAccountById(referralTransaction.accountId);
    if (!createReferralTransaction || !referral.referId) {
      return;
    }

    const refer = await this.accountService.getAccountById(referral.referId);
    if (!refer.isPartner || !refer.exchangeCommissionCoefficient) {
      return;
    }

    let transaction = new TransactionEntity({
      type: TransactionType.Referral,
      status: TransactionStatus.Referral,
      creation: new TransactionCreationEmbedded({ creationAccount: refer, date: new Date() }),
      edit: new TransactionLastEditEmbedded({ date: new Date(0) }),
      account: refer,

      referral,
      referralTransaction,
      referralData: new TransactionReferralEmbedded({
        serviceFee: referralTransaction.exchange.fee.amount,
        transactionAmount: referralTransaction.exchange.from.amount,

        amount: referralTransaction.exchange.fee.amount.multipliedBy(refer.exchangeCommissionCoefficient),
        currency: referralTransaction.exchange.fee.currency,
      }),
    });

    try {
      transaction = await this.transactionRepository.correctSave(transaction);

      this.eventBus.publish(new TransactionAddTransactionEvent({
        account: refer,
        transaction,
        pushToRedis: true,
      }));

      return transaction;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}