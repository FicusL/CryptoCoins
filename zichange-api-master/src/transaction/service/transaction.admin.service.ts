import { Injectable } from '@nestjs/common';
import { ITransactionGetFilters } from '../abstract/transaction.get.filters.interface';
import { TransactionRepository } from '../repository/transaction.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEntity } from '../entity/transaction.entity';
import { BigNumber } from 'bignumber.js';
import { TransactionHTTPExceptions } from '../const/transaction.http.exceptions';
import { AccountService } from '../../account/service/account.service';
import { TransactionDepositEmbedded } from '../entity/embedded/transaction-parts/transaction.deposit.embedded';
import { TransactionExchangeEmbedded } from '../entity/embedded/transaction-parts/transaction.exchange.embedded';
import { TransactionWithdrawalEmbedded } from '../entity/embedded/transaction-parts/transaction.withdrawal.embedded';
import { ITransactionChangeAmount } from '../abstract/transaction.change-amount.interface';
import { ITransactionChangeFee } from '../abstract/transaction.change-fee.interface';
import { EventBus } from '@nestjs/cqrs';
import { TransactionChangeTransactionEvent } from '../events/impl/transaction.change-transaction.event';

@Injectable()
export class TransactionAdminService {
  constructor(
    private readonly eventBus: EventBus,

    @InjectRepository(TransactionRepository)
    private readonly transactionRepository: TransactionRepository,

    private readonly accountService: AccountService,
  ) { }

  async getTransactions(filters: ITransactionGetFilters) {
    return await this.transactionRepository.getAllTransactionWithFilters(filters);
  }

  async getAmountOfTransactions(filters: ITransactionGetFilters) {
    return await this.transactionRepository.getAmountEntities(filters);
  }

  async changeTransactionFeeAmount(
    transaction: TransactionEntity,
    adminAccountId: number,
    fees: ITransactionChangeFee,
  ): Promise<TransactionEntity> {
    const oldTransaction = new TransactionEntity(transaction);

    if (fees.depositFeeAmount) {
      this.checkThatTransactionHasPart(transaction.deposit);
      this.checkThatAmountMoreThanFee({ amount: transaction.deposit.amount, fee: fees.depositFeeAmount });

      transaction.deposit.fee.amount = fees.depositFeeAmount;
    }

    if (fees.exchangeFeeAmount) {
      this.checkThatTransactionHasPart(transaction.exchange);
      this.checkThatAmountMoreThanFee({ amount: transaction.exchange.from.amount, fee: fees.exchangeFeeAmount });

      transaction.exchange.fee.amount = fees.exchangeFeeAmount;
    }

    if (fees.withdrawalFeeAmount) {
      this.checkThatTransactionHasPart(transaction.withdrawal);
      this.checkThatAmountMoreThanFee({ amount: transaction.withdrawal.amount, fee: fees.withdrawalFeeAmount });

      transaction.withdrawal.fee.amount = fees.withdrawalFeeAmount;
    }

    transaction.edit.editAccount = await this.accountService.getAccountById(adminAccountId);

    transaction = await this.transactionRepository.correctSave(transaction);

    this.eventBus.publish(new TransactionChangeTransactionEvent({
      oldTransaction,
      newTransaction: transaction,
    }));

    return transaction;
  }

  async changeTransactionAmount(
    transaction: TransactionEntity,
    adminAccountId: number,
    amounts: ITransactionChangeAmount,
  ): Promise<TransactionEntity> {
    const oldTransaction = new TransactionEntity(transaction);

    if (amounts.depositFromAmount) {
      this.checkThatTransactionHasPart(transaction.deposit);
      this.checkThatAmountMoreThanFee({ amount: amounts.depositFromAmount, fee: transaction.deposit.fee.value });

      transaction.deposit.amount = amounts.depositFromAmount;
    }

    if (amounts.exchangeFromAmount) {
      this.checkThatTransactionHasPart(transaction.exchange);
      this.checkThatAmountMoreThanFee({ amount: amounts.exchangeFromAmount, fee: transaction.exchange.fee.value });

      transaction.exchange.from.amount = amounts.exchangeFromAmount;
    }

    if (amounts.exchangeToAmount) {
      this.checkThatTransactionHasPart(transaction.exchange);

      transaction.exchange.to.amount = amounts.exchangeToAmount;
    }

    if (amounts.withdrawalFromAmount) {
      this.checkThatTransactionHasPart(transaction.withdrawal);
      this.checkThatAmountMoreThanFee({ amount: amounts.withdrawalFromAmount, fee: transaction.withdrawal.fee.value });

      transaction.withdrawal.amount = amounts.withdrawalFromAmount;
    }

    transaction.edit.editAccount = await this.accountService.getAccountById(adminAccountId);

    transaction = await this.transactionRepository.correctSave(transaction);

    this.eventBus.publish(new TransactionChangeTransactionEvent({
      oldTransaction,
      newTransaction: transaction,
    }));

    return transaction;
  }

  // region Private methods

  private checkThatTransactionHasPart(part: TransactionDepositEmbedded | TransactionExchangeEmbedded | TransactionWithdrawalEmbedded) {
    if (!part) {
      throw new TransactionHTTPExceptions.IncompatibleTransactionType();
    }

    if (!part.isActive) {
      throw new TransactionHTTPExceptions.IncompatibleTransactionType();
    }
  }

  private checkThatAmountMoreThanFee(data: { amount: BigNumber, fee: BigNumber }) {
    if (data.amount.isLessThan(data.fee)) {
      throw new TransactionHTTPExceptions.AmountLessThanFee();
    }
  }

  // endregion
}