import { Controller, InternalServerErrorException, Logger } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { Session } from '@nestjs/common';
import { Param, Request } from '@nestjs/common';
import { Body, Response } from '@nestjs/common';
import { OutPaymentAdvancedCashFormDTO } from '../dto/out.payment-advanced-cash-form.dto';
import { PaymentAdvancedCashService } from '../service/payment.advanced-cash.service';
import { InPaymentAdvancedCashHandleDTO } from '../dto/in.payment-advanced-cash-handle.dto';
import { InPaymentAdvancedCashSuccessDTO } from '../dto/in.payment-advanced-cash-success.dto';
import { InPaymentAdvancedCashFailDTO } from '../dto/in.payment-advanced-cash-fail.dto';
import { AuthorizedGuardHttp } from '../../core/guard/authorized.guard.http';
import { IAccountSession } from '../../account/abstract/account.session.interface';

@Controller('transactions/payment/advanced_cash')
export class PaymentAdvancedCashController {
  constructor(
    private readonly service: PaymentAdvancedCashService,
  ) { }

  @Get('form/:referenceId')
  @UseGuards(AuthorizedGuardHttp)
  async generateFormData(
    @Session() session: IAccountSession,
    @Param('referenceId') referenceId: string,
  ): Promise<OutPaymentAdvancedCashFormDTO> {
    return this.service.generateFormData(session.accountId, referenceId);
  }

  @Get('handler')
  async handlePaymentGet(
    @Body() body: InPaymentAdvancedCashHandleDTO,
    @Request() request,
  ): Promise<string> {
    const IP = request.headers['cf-connecting-ip'] || request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    const isAdvancedCashIP = ['50.7.115.5', '51.255.40.139'].indexOf(IP) !== -1;
    if (!isAdvancedCashIP) {
      Logger.error(`Incorrect isAdvancedCashIP: ${IP}`, undefined, PaymentAdvancedCashController.name);
      throw new InternalServerErrorException();
    }

    const query: InPaymentAdvancedCashHandleDTO = request.query;
    return this.service.handlePayment(query);
  }

  @Get('success')
  async onSuccessfulTransactionGet(
    @Body() body: InPaymentAdvancedCashSuccessDTO,
    @Response() response,
    @Request() request,
  ) {
    const query: InPaymentAdvancedCashSuccessDTO = request.query;
    response.redirect(`/dashboard/transactions/${query.ac_order_id}/payment_success`);
  }

  @Get('fail')
  async onFailedTransactionGet(
    @Body() body: InPaymentAdvancedCashFailDTO,
    @Response() response,
    @Request() request,
  ) {
    const query: InPaymentAdvancedCashFailDTO = request.query;
    response.redirect(`/dashboard/transactions/${query.ac_order_id}/payment_fail`);
  }
}