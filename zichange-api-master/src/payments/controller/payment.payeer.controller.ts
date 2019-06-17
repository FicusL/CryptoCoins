import { Controller, InternalServerErrorException, Logger } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { Session } from '@nestjs/common';
import { Param, Request } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Response } from '@nestjs/common';
import {PaymentPayeerService} from '../service/payment.payeer.service';
import {OutPaymentPayeerFormDTO} from '../dto/out.payment-payeer-form.dto';
import {InPaymentPayeerHandleDTO} from '../dto/in.payment-payeer-handle.dto';
import {IAccountSession} from '../../account/abstract/account.session.interface';
import {AuthorizedGuardHttp} from '../../core/guard/authorized.guard.http';

@Controller('transactions/payment/payeer')
export class PaymentPayeerController {
  constructor(
    private readonly service: PaymentPayeerService,
  ) { }

  @Post('log_information')
  async logInformation(
    @Body() body: any,
    @Request() request,
  ) {
    Logger.log(`body: ${JSON.stringify(body)}`, PaymentPayeerController.name);
    Logger.log(`request.query: ${JSON.stringify(request.query)}`, PaymentPayeerController.name);
    Logger.log(`request.headers: ${JSON.stringify(request.headers)}`, PaymentPayeerController.name);
  }

  @Get('form/:referenceId')
  @UseGuards(AuthorizedGuardHttp)
  async generateFormData(
    @Session() session: IAccountSession,
    @Param('referenceId') referenceId: string,
  ): Promise<OutPaymentPayeerFormDTO> {
    return this.service.generateFormData(session.accountId, referenceId);
  }

  @Post('handler')
  async handlePayment(
    @Body() body: InPaymentPayeerHandleDTO,
    @Request() request,
  ): Promise<string> {
    const IP = request.headers['cf-connecting-ip'] || request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    const isPayeerIP = ['185.71.65.92', '185.71.65.189', '149.202.17.210'].indexOf(IP) !== -1;
    if (!isPayeerIP) {
      throw new InternalServerErrorException();
    }

    return this.service.handlePayment(body);
  }

  @Get('success')
  async onSuccessfulTransaction(
    @Body() body,
    @Response() response,
  ) {
    response.redirect(`/dashboard/transactions/${body.m_orderid}/payment_success`);
  }

  @Get('fail')
  async onFailedTransaction(
    @Body() body,
    @Response() response,
  ) {
    response.redirect(`/dashboard/transactions/${body.m_orderid}/payment_fail`);
  }
}