import { BadRequestException, Body, Controller, Logger, Post, Request, Response } from '@nestjs/common';
import { KycRepository } from '../repository/kyc.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { KycSumsubCheckerService } from '../service/kyc-sumsub-checker.service';
import { getIPFromRequest } from '../../core/util/get-ip-from-request';
import { ISumSubCallbackBody } from '../sumsub/types/sumsub.callback-body.interface';
import { ConfigsService } from '../../core/service/configs.service';

@Controller('kyc/sumsub')
export class KycSumsubController {
  constructor(
    @InjectRepository(KycRepository)
    protected readonly kycRepository: KycRepository,

    protected readonly kycSumsubCheckerService: KycSumsubCheckerService,
  ) { }

  protected validateIP(request: any) {
    if (!ConfigsService.isProduction) {
      return;
    }

    const testEnvironmentIPs = [ '178.63.9.91', '46.4.199.187' ];
    const prodEnvironmentIPs = [ '188.93.22.74', '188.93.22.76' ];

    const ip = getIPFromRequest(request);

    // TODO: check sumsub environment: test or prod
    const isTestIP = testEnvironmentIPs.includes(ip);
    const isProdIP = prodEnvironmentIPs.includes(ip);

    const correctIP = isTestIP || isProdIP;

    if (!correctIP) {
      Logger.error(`Bad IP: ${ip}`, undefined, KycSumsubController.name);
      throw new BadRequestException('Bad IP');
    }
  }

  protected async callbackHandler(request: any, body: ISumSubCallbackBody) {
    this.validateIP(request);

    const availableTypes = [
      'INSPECTION_REVIEW_COMPLETED',
      'applicantReviewed',
    ];
    const unsupportedCallbackType = !availableTypes.includes(body.type);

    if (unsupportedCallbackType) {
      Logger.log(`Unsupported callback type: ${body.type}`, KycSumsubController.name);
      return;
    }

    const kyc = await this.kycRepository.findBySumSubId(body.applicantId);
    if (!kyc) {
      Logger.log(`Kyc not found: ${body.applicantId}`, KycSumsubController.name);
      return;
    }

    await this.kycSumsubCheckerService.processKyc(kyc);
  }

  @Post()
  async callback(
    @Body() body: ISumSubCallbackBody,
    @Request() request: any,
    @Response() response: any,
  ) {
    Logger.log(`kyc/sumsub body: ${JSON.stringify(body)}`, KycSumsubController.name);
    Logger.log(`kyc/sumsub request.query: ${JSON.stringify(request.query)}`, KycSumsubController.name);
    Logger.log(`kyc/sumsub request.headers: ${JSON.stringify(request.headers)}`, KycSumsubController.name);

    await this.callbackHandler(request, body);

    response.status(200).end();
  }
}