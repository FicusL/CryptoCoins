import {BadRequestException, Injectable, Logger} from '@nestjs/common';
import * as crypto from 'crypto';
import {PaymentService} from './payment.service';
import {TransactionHTTPExceptions} from '../../transaction/const/transaction.http.exceptions';
import {OutPaymentPayeerFormDTO} from '../dto/out.payment-payeer-form.dto';
import {InPaymentPayeerHandleDTO} from '../dto/in.payment-payeer-handle.dto';
import { BigNumber } from 'bignumber.js';
import {TransactionStatus} from '../../transaction/const/transaction.status.enum';
import {TransactionService} from '../../transaction/service/transaction.service';
import {TransactionEntity} from '../../transaction/entity/transaction.entity';
import { ConfigsService } from '../../core/service/configs.service';

@Injectable()
export class PaymentPayeerService {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly transactionService: TransactionService,
  ) { }

  async generateFormData(accountId: number, referenceId: string) {
    const transaction = await this.transactionService.getTransactionByReferenceId(accountId, referenceId);
    if (!transaction) {
      throw new TransactionHTTPExceptions.TransactionNotFound();
    }

    const key = ConfigsService.payeerSecretKey;
    const m_shop = ConfigsService.payeerMShop;

    if (!key || !m_shop) {
      throw new TransactionHTTPExceptions.UnknownError();
    }

    if (transaction.deposit.paid || transaction.status !== TransactionStatus.Pending) {
      throw new TransactionHTTPExceptions.CantBePaid();
    }

    const isCurrencyAvailable = ['USD', 'EUR', 'RUB'].indexOf(transaction.deposit.currency) !== -1;
    if (!isCurrencyAvailable) {
      throw new TransactionHTTPExceptions.CantBePaid();
    }

    const formData = new OutPaymentPayeerFormDTO();

    formData.m_shop = m_shop;
    formData.m_orderid = transaction.referenceId;
    formData.m_amount = transaction.deposit.amount.toFixed(2);
    formData.m_curr = transaction.deposit.currency;
    formData.m_desc = Buffer.from(`ZiChange transaction ${transaction.referenceId} payment`).toString('base64');
    formData.m_sign = crypto.createHash('sha256')
      .update(`${formData.m_shop}:${formData.m_orderid}:${formData.m_amount}:${formData.m_curr}:${formData.m_desc}:${key}`)
      .digest('hex')
      .toUpperCase();

    return formData;
  }

  async handlePayment(body: InPaymentPayeerHandleDTO): Promise<string> {
    const loggerContext = `${PaymentPayeerService.name}: ${Date.now()}`;

    const error = `${body.m_orderid}|error`;
    const success = `${body.m_orderid}|success`;

    if (!body.m_operation_id || !body.m_sign) {
      Logger.log('!body.m_operation_id || !body.m_sign', loggerContext);
      Logger.log(JSON.stringify(body));
      return error;
    }

    const key = ConfigsService.payeerSecretKey;
    if (!key) {
      Logger.error('!key', loggerContext);
      return error;
    }

    const { m_operation_id, m_operation_ps, m_operation_date, m_operation_pay_date, m_shop, m_orderid, m_amount, m_curr, m_desc, m_status } = body;
    let dataToCheckSign = `${m_operation_id}:${m_operation_ps}:${m_operation_date}:${m_operation_pay_date}:${m_shop}:${m_orderid}:${m_amount}:
    ${m_curr}:${m_desc}:${m_status}`;

    if (body.m_params) {
      dataToCheckSign += `:${body.m_params}`;
    }

    dataToCheckSign += `:${key}`;

    const sign = crypto.createHash('sha256')
      .update(dataToCheckSign)
      .digest('hex')
      .toUpperCase();

    if (sign !== body.m_sign) {
      Logger.log('sign !== body.m_sign', loggerContext);
      Logger.log(`sign ${sign} !== body.m_sign ${body.m_sign}`, loggerContext);
      return error;
    }

    if (body.m_status !== 'success') {
      Logger.log('body.m_status !== \'success\'', loggerContext);
      return error;
    }

    const referenceId = body.m_orderid;

    let transaction: TransactionEntity;
    try {
      transaction = await this.transactionService.getTransactionByReferenceIdOnly(referenceId);
    } catch (e) {
      Logger.error(e, loggerContext);
      return error;
    }

    if (!transaction) {
      Logger.log('!transaction', loggerContext);
      return error;
    }

    if (body.m_curr !== transaction.deposit.currency) {
      Logger.log('body.m_curr !== transaction.deposit.currency', loggerContext);
      return error;
    }

    if (!(new BigNumber(body.m_amount).isEqualTo(transaction.deposit.amount)) ){
      Logger.log('!(new BigNumber(body.m_amount).isEqualTo(transaction.deposit.amount)', loggerContext);
      throw new BadRequestException();
    }

    try {
      await this.paymentService.approvePayment(transaction);
    } catch (e) {
      Logger.log(e, loggerContext);
      return error;
    }

    return success;
  }
}