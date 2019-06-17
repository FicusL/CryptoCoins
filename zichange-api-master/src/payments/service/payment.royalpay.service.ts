import { BadRequestException, HttpService, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as Crypto from 'crypto';
import { ConfigsService } from '../../core/service/configs.service';
import { BigNumber } from 'bignumber.js';
import { TransactionEntity } from '../../transaction/entity/transaction.entity';
import { TransactionType } from '../../transaction/const/transaction.type.enum';
import { TransactionService } from '../../transaction/service/transaction.service';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionRepository } from '../../transaction/repository/transaction.repository';
import { TransactionStatus } from '../../transaction/const/transaction.status.enum';
import { InPaymentPayTransactionDTO } from '../dto/in.payment.pay-transaction.dto';
import { TransactionHTTPExceptions } from '../../transaction/const/transaction.http.exceptions';
import { IncorrectCardInformationException } from '../exceptions/IncorrectCardInformationException';
import { AccountService } from '../../account/service/account.service';
import { getIPFromRequest } from '../../core/util/get-ip-from-request';
import { KycExceptions } from '../../kyc/const/kyc.exceptions';
import { EventBus } from '@nestjs/cqrs';
import { TransactionChangeTransactionEvent } from '../../transaction/events/impl/transaction.change-transaction.event';

@Injectable()
export class PaymentRoyalPayService {
  constructor(
    private readonly eventBus: EventBus,

    protected readonly httpService: HttpService,
    protected readonly transactionService: TransactionService,
    protected readonly accountService: AccountService,

    @InjectRepository(TransactionRepository)
    protected readonly transactionRepository: TransactionRepository,
  ) { }

  // region Public methods

  public async getTransactionByCounterpartyActivationToken(token: string): Promise<TransactionEntity> {
    const transaction = await this.transactionRepository.findByCounterpartyActivationToken(token);
    if (!transaction) {
      throw new TransactionHTTPExceptions.TransactionNotFound();
    }
    return transaction;
  }

  public async payTransaction(transaction: TransactionEntity, dto: InPaymentPayTransactionDTO, request: any) {
    this.verifyTransaction(transaction);

    const account = await this.accountService.getAccountById(transaction.accountId);
    if (!account.kyc) {
      throw new KycExceptions.KYCNotFound();
    }

    if (!account.kyc.phone) {
      throw new KycExceptions.PhoneNotFound();
    }

    const currency = transaction.deposit.currency;
    const amount = transaction.deposit.amount;

    return await this.createTransaction(transaction.referenceId, currency, amount, {
      card_number: dto.cardNumber,
      cardholder_name: dto.name,
      card_year: dto.expirationYear,
      card_month: dto.expirationMonth,
      card_cvv: dto.cvc,
      client_email: account.email,
      client_phone: account.kyc.phone,
      client_ip: getIPFromRequest(request),
      client_user_agent: request.headers['user-agent'],
    });
  }

  public async processPayCallback(body: any, request: any) {
    const { auth, sign } = request.headers;

    if (auth !== ConfigsService.royalPayAuthToken) {
      Logger.error('Bad auth token', undefined, PaymentRoyalPayService.name);
      throw new InternalServerErrorException('Bad auth token');
    }

    const signature = this.createSignature(body);
    if (signature !== sign) {
      Logger.error('Bad signature', undefined, PaymentRoyalPayService.name);
      throw new InternalServerErrorException('Bad signature');
    }

    if (body.type !== 'deposit') {
      Logger.error('Type must be deposit', undefined, PaymentRoyalPayService.name);
      throw new InternalServerErrorException('Type must be deposit');
    }

    if (body.status !== 'ok') {
      Logger.error('status !== ok', undefined, PaymentRoyalPayService.name);
      return;
    }

    const referenceId = body.transaction_id;
    let transaction = await this.transactionService.getTransactionByReferenceIdOnly(referenceId);
    this.verifyTransaction(transaction);

    // NOTE: may be different currency
    // if (transaction.deposit.currency !== body.currency) {
    //   throw new BadRequestException('Different currencies');
    // }

    // NOTE: may be different currency
    // transaction.deposit.amount = new BigNumber(body.amount_client);

    const oldTransaction = new TransactionEntity(transaction);

    transaction.deposit.paid = true;

    if (transaction.type === TransactionType.Deposit) {
      transaction.status = TransactionStatus.Completed;
    } else {
      transaction.status = TransactionStatus.Pending;
    }

    transaction = await this.transactionRepository.correctSave(transaction);
    this.eventBus.publish(new TransactionChangeTransactionEvent({
      oldTransaction,
      newTransaction: transaction,
    }));
  }

  // endregion

  // region Private methods

  protected createSignature(data: any) {
    const message = JSON.stringify(data) + ConfigsService.royalPaySecretKey;
    return Crypto.createHash('md5').update(message).digest('hex').toLowerCase();
  }

  protected verifyTransaction(transaction: TransactionEntity) {
    if (!transaction.deposit.isActive) {
      throw new BadRequestException('Transaction must have deposit part deposit');
    }

    const availableTypes = [ TransactionType.Deposit, TransactionType.DepositExchange, TransactionType.DepositExchangeWithdrawal ];
    if (!availableTypes.includes(transaction.type)) {
      throw new BadRequestException('Transaction must have deposit part deposit. Bad transaction Type');
    }

    if (transaction.deposit.paid) {
      throw new BadRequestException('Transaction already paid');
    }

    const availableCurrencies = [ 'RUB', 'EUR', 'USD' ];
    if (!availableCurrencies.includes(transaction.deposit.currency)) {
      throw new BadRequestException('Unavailable currency');
    }
  }

  protected async createTransaction(transactionReferenceId: string, currency: string, amount: BigNumber, system_fields: ICardFields) {
    const url = 'https://royalpay.eu/api/deposit/create';
    const baseForCallbacks = `${ConfigsService.domainBackEnd}/api/transactions/payment/royalpay`;
    const queryForUrls = `?referenceId=${transactionReferenceId}`;

    const data = {
      transaction_id: transactionReferenceId,
      amount: amount.toString(),
      currency,
      payment_system: ConfigsService.royalPayTestMode ? 'CardGateTestS2S' : 'CardGateS2S',
      note: `Transaction reference id: ${transactionReferenceId}`,
      system_fields,
      url: {
        callback_url: `${baseForCallbacks}/callback`,
        fail_url: `${baseForCallbacks}/fail${queryForUrls}`,
        pending_url: `${baseForCallbacks}/pending${queryForUrls}`,
        success_url: `${baseForCallbacks}/success${queryForUrls}`,
      },
    };

    const signature = this.createSignature(data);

    let result: any;

    try {
      const response = await this.httpService.post(url, data, {
        headers: {
          Auth: ConfigsService.royalPayAuthToken,
          Sign: signature,
        },
      }).toPromise();

      result = response.data;
    } catch (e) {
      Logger.error(e.message, undefined, PaymentRoyalPayService.name);

      const responseData = JSON.stringify(e.response.data);
      Logger.error(responseData, undefined, PaymentRoyalPayService.name);

      if (e.response.status === 400) {
        throw new IncorrectCardInformationException();
      }

      throw new InternalServerErrorException(responseData);
    }

    if (result.status !== 'created') {
      throw new InternalServerErrorException('result.status !== created');
    }

    return result.redirect;
  }

  // endregion
}

interface ICardFields {
  card_number: string;
  card_month: string;
  card_year: string;
  cardholder_name: string;
  card_cvv: string;
  client_email: string;
  client_phone: string;
  client_ip: string;
  client_user_agent: string; // (User agent of client browser).
}