import { Body, Controller, Get, Logger, Post, Request, Response } from '@nestjs/common';

@Controller('transactions/payment/rbk_money')
export class PaymentRbkMoneyController {
  constructor( ) { }

  @Post('log') // TODO: delete later. Only for test integration
  async log_post(@Body() body: any, @Request() request, @Response() response) {
    this.printInfo('log_post', body, request);
    response.status(200).send();
  }

  @Get('log') // TODO: delete later. Only for test integration
  async log_get(@Body() body: any, @Request() request, @Response() response) {
    this.printInfo('log_get', body, request);
    response.status(200).send();
  }

  protected printInfo(title: string, body: any, request: any) {
    Logger.log(`${title} body: ${JSON.stringify(body)}`, PaymentRbkMoneyController.name);
    Logger.log(`${title} request.query: ${JSON.stringify(request.query)}`, PaymentRbkMoneyController.name);
    Logger.log(`${title} request.headers: ${JSON.stringify(request.headers)}`, PaymentRbkMoneyController.name);
  }
}