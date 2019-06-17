import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { AccountExceptions } from '../../account/const/account.exceptions';
import { CoreEmailService } from '../../core/modules/email/core.email.service';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionRepository } from '../../transaction/repository/transaction.repository';
import { ConfigsService } from '../../core/service/configs.service';
import { TransactionEntity } from '../../transaction/entity/transaction.entity';
import { TransactionHTTPExceptions } from '../../transaction/const/transaction.http.exceptions';
import { TransactionAlreadyActivatedException } from '../exceptions/transaction-already-activated.exception';
import { CounterpartyTransactionStepsEnum } from '../const/counterparty.transaction-steps.enum';
import { AccountService } from '../../account/service/account.service';
import { KycStatus } from '../../kyc/const/kyc.status';
import { TransactionStatus } from '../../transaction/const/transaction.status.enum';
import { TransactionNotActivatedException } from '../exceptions/transaction-not-activated.exception';
import { CounterpartyRepository } from '../repository/counterparty.repository';
import { CanNotDefineTransactionStepException } from '../exceptions/can-not-define-transaction-step.exception';

@Injectable()
export class CounterpartyAccountService {
  protected static readonly CodeExpiredAt = 5 * 60 * 1000;

  constructor(
    @InjectRepository(TransactionRepository)
    protected readonly transactionRepository: TransactionRepository,

    @InjectRepository(CounterpartyRepository)
    protected readonly counterpartyRepository: CounterpartyRepository,

    protected readonly emailService: CoreEmailService,
    protected readonly accountService: AccountService,
  ) { }

  verifyTransactionActivated(transaction: TransactionEntity) {
    if (!transaction.counterpartyIsActivated) {
      throw new TransactionNotActivatedException();
    }
  }

  async getTransactionByCounterpartyActivationToken(token: string): Promise<TransactionEntity> {
    const transaction = await this.transactionRepository.findByCounterpartyActivationToken(token);
    if (!transaction) {
      throw new TransactionHTTPExceptions.TransactionNotFound();
    }
    return transaction;
  }

  protected generateVerifyCounterpartyURL(counterpartyToken: string, counterpartyAccountId: number, code: string) {
    return `${ConfigsService.domainFrontEnd}/counterparties/${counterpartyAccountId}/transactions/${counterpartyToken}/verify&code=${code}`;
  }

  async getCurrentStep(transaction: TransactionEntity): Promise<CounterpartyTransactionStepsEnum> {
    if (!transaction.counterpartyIsActivated) {
      return CounterpartyTransactionStepsEnum.TransactionNotActivated;
    }

    const account = await this.accountService.getAccountById(transaction.accountId);
    const kyc = account.kyc;

    if (!kyc || kyc.status === KycStatus.Unapproved) {
      return CounterpartyTransactionStepsEnum.NotKyc;
    }

    if (kyc.status === KycStatus.Tier1Pending) {
      return CounterpartyTransactionStepsEnum.KycPending;
    }

    if (kyc.status === KycStatus.Tier1Rejected) {
      return CounterpartyTransactionStepsEnum.KycRejected;
    }

    const transactionIsPending =
      transaction.status === TransactionStatus.Pending ||
      transaction.status === TransactionStatus.Approved;

    if (transactionIsPending && transaction.deposit.paid) {
      return CounterpartyTransactionStepsEnum.TransactionCompleted;
    }

    if (transactionIsPending) {
      return CounterpartyTransactionStepsEnum.TransactionPending;
    }

    const transactionIsCompleted =
      transaction.status === TransactionStatus.BoundaryDepositApproved ||
      transaction.status === TransactionStatus.BoundaryExchangeApproved ||
      transaction.status === TransactionStatus.Completed;

    if (transactionIsCompleted) {
      return CounterpartyTransactionStepsEnum.TransactionCompleted;
    }

    if (transaction.status === TransactionStatus.Rejected || transaction.status === TransactionStatus.PaymentFailed) {
      return CounterpartyTransactionStepsEnum.TransactionRejected;
    }

    throw new CanNotDefineTransactionStepException();
  }

  protected async sendCodeWithStyles(
    email: string,
    data: { code: string, activationUrl: string, styles: object, url: string, logoUrl: string, letterTextFooter: string },
  ) {
    await this.emailService.send({
      subject: 'ZiChange',
      to: email,
    }, 'send-counterparty-code', data);
  }

  protected async sendCodeWithoutStyles(
    email: string,
    data: { code: string, activationUrl: string, url: string, logoUrl: string, letterTextFooter: string },
  ) {
    try {
      await this.emailService.send({
        subject: 'ZiChange',
        to: email,
      }, 'send-counterparty-code-without-styles', data);
    } catch (e) {
      Logger.error(e.message, undefined, CounterpartyAccountService.name);
      throw new InternalServerErrorException();
    }
  }

  async sendCode(transaction: TransactionEntity, email: string) {
    if (transaction.counterpartyIsActivated) {
      throw new TransactionAlreadyActivatedException();
    }

    const code = this.generateCode();
    const expiredTime = new Date(Date.now() + CounterpartyAccountService.CodeExpiredAt);

    transaction.counterpartyActivationCode = code;
    transaction.counterpartyActivationCodeExpiration = expiredTime;

    try {
      transaction = await this.transactionRepository.save(transaction);
    } catch (e) {
      Logger.error(e.message, undefined, CounterpartyAccountService.name);
      throw new InternalServerErrorException();
    }

    const counterparty = (await this.counterpartyRepository.getByAccountId(transaction.counterpartyId!))!;

    const activationUrl = this.generateVerifyCounterpartyURL(transaction.counterpartyActivationToken!, transaction.counterpartyId!, code);
    const sendData = {
      code,
      activationUrl,
      url: counterparty.url!,
      logoUrl: `${ConfigsService.domainBackEnd}/api/counterparties/${counterparty.accountId}/logo`,
      styles: counterparty.styles!,
      letterTextFooter: counterparty.letterTextFooter || 'Take care, Zichange',
    };

    try {
      await this.sendCodeWithStyles(email, sendData);
    } catch (e) {
      Logger.error(e.message, undefined, CounterpartyAccountService.name);

      try {
        await this.sendCodeWithoutStyles(email, sendData);
      } catch (e) {
        Logger.error(e.message, undefined, CounterpartyAccountService.name);

        throw new InternalServerErrorException();
      }
    }
  }

  async activateTransaction(transaction: TransactionEntity, code: string): Promise<TransactionEntity> {
    if (transaction.counterpartyIsActivated) {
      throw new TransactionAlreadyActivatedException();
    }

    if (transaction.counterpartyActivationCode !== code) {
      throw new AccountExceptions.IncorrectCounterpartyCode();
    }

    if (!transaction.counterpartyActivationCodeExpiration) {
      throw new AccountExceptions.IncorrectCounterpartyCode();
    }

    if (transaction.counterpartyActivationCodeExpiration < (new Date())) {
      throw new AccountExceptions.IncorrectCounterpartyCode();
    }

    transaction.counterpartyIsActivated = true;

    try {
      return await this.transactionRepository.save(transaction);
    } catch (e) {
      Logger.error(e.message, undefined, CounterpartyAccountService.name);
      throw new InternalServerErrorException();
    }
  }

  protected generateCode(): string {
    return `${Math.floor(Math.random() * 1000000)}`.padEnd(6, '0');
  }
}