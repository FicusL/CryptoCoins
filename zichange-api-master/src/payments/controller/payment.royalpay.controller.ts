import { Body, Controller, Get, HttpService, Logger, Param, Post, Request, Response } from '@nestjs/common';
import { PaymentRoyalPayService } from '../service/payment.royalpay.service';
import { InPaymentPayTransactionDTO } from '../dto/in.payment.pay-transaction.dto';
import { TransactionService } from '../../transaction/service/transaction.service';
import { TransactionNotActivatedException } from '../../counterparty/exceptions/transaction-not-activated.exception';
import { ConfigsService } from '../../core/service/configs.service';

@Controller('transactions/payment/royalpay')
export class PaymentRoyalPayController {
  constructor(
    protected readonly paymentRoyalPayService: PaymentRoyalPayService,
    protected readonly transactionService: TransactionService,
    protected readonly httpService: HttpService,
  ) { }

  @Post('reference/:referenceId')
  async payTransactionViaReference(
    @Param('referenceId') referenceId: string,
    @Body() dto: InPaymentPayTransactionDTO,
    @Request() request: any,
  ) {
    InPaymentPayTransactionDTO.validateExpirationDate(dto);
    const transaction = await this.transactionService.getTransactionByReferenceIdOnly(referenceId);

    return await this.paymentRoyalPayService.payTransaction(transaction, dto, request);
  }

  @Post('token/:token')
  async payTransactionViaToken(
    @Param('token') token: string,
    @Body() dto: InPaymentPayTransactionDTO,
    @Request() request: any,
  ) {
    InPaymentPayTransactionDTO.validateExpirationDate(dto);
    const transaction = await this.paymentRoyalPayService.getTransactionByCounterpartyActivationToken(token);
    if (!transaction.counterpartyIsActivated) {
      throw new TransactionNotActivatedException();
    }

    return await this.paymentRoyalPayService.payTransaction(transaction, dto, request);
  }

  @Post('callback')
  async callback_url_post(@Body() body: any, @Request() request, @Response() response) {
    this.printInfo('callback_url_post', body, request);

    await this.paymentRoyalPayService.processPayCallback(body, request);

    response.status(200).send({ answer: 'ok' });
  }

  @Get('fail')
  async fail_url_get(@Body() body: any, @Request() request, @Response() response) {
    const referenceId = request.query.referenceId;
    const transaction = await this.transactionService.getTransactionByReferenceIdOnly(referenceId);

    if (transaction.counterpartyId) {
      response.redirect(
        `${ConfigsService.domainFrontEnd}/counterparties/${transaction.counterpartyId}/transactions/${transaction.counterpartyActivationToken}`);
    } else {
      response.redirect(`${ConfigsService.domainFrontEnd}/dashboard/transactions/${referenceId}/payment_fail`);
    }
  }

  @Get('pending')
  async pending_url_get(@Body() body: any, @Request() request, @Response() response) {
    const referenceId = request.query.referenceId;
    const transaction = await this.transactionService.getTransactionByReferenceIdOnly(referenceId);

    if (transaction.counterpartyId) {
      response.redirect(
        `${ConfigsService.domainFrontEnd}/counterparties/${transaction.counterpartyId}/transactions/${transaction.counterpartyActivationToken}`);
    } else {
      response.redirect(`${ConfigsService.domainFrontEnd}/dashboard/transactions/${referenceId}/payment_fail`);
    }
  }

  @Get('success')
  async success_url_get(@Body() body: any, @Request() request, @Response() response) {
    const referenceId = request.query.referenceId;
    const transaction = await this.transactionService.getTransactionByReferenceIdOnly(referenceId);

    if (transaction.counterpartyId) {
      response.redirect(
        `${ConfigsService.domainFrontEnd}/counterparties/${transaction.counterpartyId}/transactions/${transaction.counterpartyActivationToken}`);
    } else {
      response.redirect(`${ConfigsService.domainFrontEnd}/dashboard/transactions/${referenceId}/payment_success`);
    }
  }

  protected printInfo(title: string, body: any, request: any) {
    Logger.log(`${title} body: ${JSON.stringify(body)}`, PaymentRoyalPayController.name);
    Logger.log(`${title} request.query: ${JSON.stringify(request.query)}`, PaymentRoyalPayController.name);
    Logger.log(`${title} request.headers: ${JSON.stringify(request.headers)}`, PaymentRoyalPayController.name);
  }
}