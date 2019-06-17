import {BadRequestException, Injectable, Logger} from '@nestjs/common';
import {TransactionHTTPExceptions} from '../../transaction/const/transaction.http.exceptions';
import {TransactionStatus} from '../../transaction/const/transaction.status.enum';
import {OutPaymentAdvancedCashFormDTO} from '../dto/out.payment-advanced-cash-form.dto';
import * as crypto from 'crypto';
import {PaymentService} from './payment.service';
import { BigNumber } from 'bignumber.js';
import {InPaymentAdvancedCashHandleDTO} from '../dto/in.payment-advanced-cash-handle.dto';
import {TransactionEntity} from '../../transaction/entity/transaction.entity';
import {TransactionService} from '../../transaction/service/transaction.service';
import { ConfigsService } from '../../core/service/configs.service';

@Injectable()
export class PaymentAdvancedCashService {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly transactionService: TransactionService,
  ) { }

  async generateFormData(accountId: number, referenceId: string): Promise<OutPaymentAdvancedCashFormDTO> {
    const transaction = await this.transactionService.getTransactionByReferenceId(accountId, referenceId);
    if (!transaction) {
      throw new TransactionHTTPExceptions.TransactionNotFound();
    }

    const key = ConfigsService.advancedCashSecretKey;
    const ac_email = ConfigsService.advancedCashAcAccountEmail;
    const ac_sci_name = ConfigsService.advancedCashAcSciName;

    if (!key || !ac_email || !ac_sci_name) {
      throw new TransactionHTTPExceptions.UnknownError();
    }

    if (transaction.deposit.paid || transaction.status !== TransactionStatus.Pending) {
      throw new TransactionHTTPExceptions.CantBePaid();
    }

    const isCurrencyAvailable = ['USD', 'EUR', 'RUB', 'GBP', 'UAH', 'KZT', 'BRL'].indexOf(transaction.deposit.currency) !== -1;
    if (!isCurrencyAvailable) {
      throw new TransactionHTTPExceptions.CantBePaid();
    }

    const formData = new OutPaymentAdvancedCashFormDTO();

    formData.ac_account_email = ac_email;
    formData.ac_sci_name = ac_sci_name;
    formData.ac_amount = transaction.deposit.amount.toFixed(2);
    formData.ac_ps = 'ADVANCED_CASH';
    formData.ac_currency = transaction.deposit.currency;
    formData.ac_order_id = transaction.referenceId;
    formData.ac_comments = `ZiChange transaction ${transaction.referenceId} payment`;
    formData.ac_sign = crypto.createHash('sha256')
      .update(`${formData.ac_account_email}:${formData.ac_sci_name}:${formData.ac_amount}:${formData.ac_currency}:${key}:${formData.ac_order_id}`)
      .digest('hex');

    return formData;
  }

  async handlePayment(body: InPaymentAdvancedCashHandleDTO): Promise<string> {
    const loggerContext = `${PaymentAdvancedCashService.name}: ${Date.now()}`;

    const key = ConfigsService.advancedCashSecretKey;
    const ac_email = ConfigsService.advancedCashAcAccountEmail;
    const ac_sci_name_env = ConfigsService.advancedCashAcSciName;

    if (!key || !ac_email || !ac_sci_name_env) {
      Logger.error('!key', loggerContext);
      throw new TransactionHTTPExceptions.UnknownError();
    }

    const { ac_transfer, ac_start_date, ac_sci_name, ac_src_wallet, ac_dest_wallet, ac_order_id, ac_amount, ac_merchant_currency } = body;
    // NOTE: not touch this code
    const dataToCheckSign =
      `${ac_transfer}:${ac_start_date}:${ac_sci_name}:${ac_src_wallet}` +
      `:${ac_dest_wallet}:${ac_order_id}:${ac_amount}:${ac_merchant_currency}:${key}`;

    const sign = crypto.createHash('sha256')
      .update(dataToCheckSign)
      .digest('hex')
      .toLowerCase();

    if (sign !== body.ac_hash) {
      Logger.log(`sign ${sign} !== body.ac_hash ${body.ac_hash}`, loggerContext);
      Logger.log(JSON.stringify(body));
      throw new TransactionHTTPExceptions.UnknownError();
    }

    const referenceId = body.ac_order_id;

    let transaction: TransactionEntity;
    try {
      transaction = await this.transactionService.getTransactionByReferenceIdOnly(referenceId);
    } catch (e) {
      Logger.error(e, loggerContext);
      throw new BadRequestException();
    }

    if (!transaction) {
      Logger.log('!transaction', loggerContext);
      throw new BadRequestException();
    }

    // NOTE: user can pay other currency
    // if (body.ac_buyer_currency !== transaction.deposit.currency) {
    //   Logger.log('body.ac_buyer_currency !== transaction.deposit.currency', loggerContext);
    //   Logger.log(JSON.stringify(body) + ' ' + JSON.stringify(transaction));
    //   throw new BadRequestException();
    // }

    if (!(new BigNumber(body.ac_amount).isEqualTo(transaction.deposit.amount)) ){
      Logger.log('!(new BigNumber(body.ac_amount).isEqualTo(transaction.deposit.amount)', loggerContext);
      Logger.log(JSON.stringify(body) + ' ' + JSON.stringify(transaction));
      throw new BadRequestException();
    }

    try {
      await this.paymentService.approvePayment(transaction);
    } catch (e) {
      Logger.log(e, loggerContext);
      throw new BadRequestException();
    }

    return '';
  }
}