import { Body, Controller, ForbiddenException, Get, Param, ParseIntPipe, Post, Put, Response, Session, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { AccountAccessParam } from '../../core/decorators/account.access.param.decorator';
import { IAccountSession } from '../../account/abstract/account.session.interface';
import { InKycChangeStatusDto } from '../dto/in.kyc.change.status.dto';
import { AccountAccessGuard } from '../../core/guard/account.access.guard';
import { KycService } from '../service/kyc.service';
import { AuthorizedGuardAmlOfficerHttp } from '../../core/guard/authorized.guard.aml-officer.http';
import { OutKycDto } from '../dto/out.kyc.dto';
import { InKycGetFiltersDTO } from '../dto/in.kyc.get-filters.dto';
import { OutKycAmountDTO } from '../dto/out.kyc.amount.dto';
import { InKycGetAmountDTO } from '../dto/in.kyc.get-amount.dto';
import { AccountService } from '../../account/service/account.service';
import { OutKycInfoFromSumsubDTO } from '../dto/out.kyc.info-from-sumsub.dto';
import { KycExceptions } from '../const/kyc.exceptions';
import { AuthorizedGuardHttp } from '../../core/guard/authorized.guard.http';
import { KycPdfHelperService } from '../service/kyc.pdf-helper.service';

@Controller('account')
export class KycController {
  constructor(
    protected readonly kycService: KycService,
    protected readonly kycPdfHelperService: KycPdfHelperService,
    protected readonly accountService: AccountService,
  ) { }

  // region Admins methods

  @Get('/kyc')
  @UseGuards(AuthorizedGuardAmlOfficerHttp)
  @ApiUseTags('Admin')
  @ApiOperation({title: 'Get all KYC'})
  @ApiResponse({ status: 200, type: OutKycDto, isArray: true })
  async getAllKyc(): Promise<OutKycDto[]> {
    return await this.kycService.getAllKycDTO();
  }

  @Post('/kyc')
  @UseGuards(AuthorizedGuardAmlOfficerHttp)
  @ApiUseTags('Admin')
  @ApiOperation({title: 'Get KYC with filters'})
  @ApiResponse({ status: 200, type: OutKycDto, isArray: true })
  async getKycWithFilters(
    @Body() dto: InKycGetFiltersDTO,
  ): Promise<OutKycDto[]> {
    const result = await this.kycService.getKycWithFilters(dto);
    return result.map(entity => new OutKycDto(entity));
  }

  @Get(':accountId/kyc/sumsub')
  @UseGuards(AuthorizedGuardAmlOfficerHttp)
  @ApiUseTags('Admin')
  @ApiOperation({title: 'Get KYC info from SumSub'})
  @ApiResponse({ status: 200, type: OutKycInfoFromSumsubDTO })
  async getKycInfoFromSumSub(
    @Param('accountId', new ParseIntPipe()) accountId: number,
  ): Promise<OutKycInfoFromSumsubDTO> {
    const account = await this.accountService.getAccountById(accountId);
    return await this.kycService.getSumSubInfoByAccountId(account);
  }

  @Post('/kyc/amount')
  @UseGuards(AuthorizedGuardAmlOfficerHttp)
  @ApiUseTags('Admin')
  @ApiOperation({title: 'Get the number of KYC that match the filters'})
  @ApiResponse({ status: 200, type: OutKycAmountDTO })
  async getAmountKycWithFilters(
    @Body() dto: InKycGetAmountDTO,
  ): Promise<OutKycAmountDTO> {
    const amount = await this.kycService.getAmountOfKYC(dto);
    return new OutKycAmountDTO(amount);
  }

  @Get('/kyc/pending')
  @UseGuards(AuthorizedGuardAmlOfficerHttp)
  @ApiUseTags('Admin')
  @ApiOperation({title: 'Get all pending KYC'})
  @ApiResponse({ status: 200, type: OutKycDto, isArray: true })
  async getAllPendingKyc(): Promise<OutKycDto[]> {
    return await this.kycService.getAllPendingKycDTO();
  }

  @Get(':accountId/kyc')
  @UseGuards(AuthorizedGuardAmlOfficerHttp)
  @ApiUseTags('Admin')
  @ApiOperation({title: 'Get KYC info'})
  @ApiResponse({ status: 200, type: OutKycDto })
  async getKycInfo(
    @Param('accountId', new ParseIntPipe()) accountId: number,
  ): Promise<OutKycDto> {
    const account = await this.accountService.getAccountById(accountId);
    return await this.kycService.getKycDto(account);
  }

  @Get(':accountId/kyc/pdf')
  @UseGuards(AuthorizedGuardAmlOfficerHttp)
  @ApiUseTags('Admin')
  @ApiOperation({title: 'Get KYC PDF'})
  async getKycPDFInfo(
    @Response() response,
    @Param('accountId', new ParseIntPipe()) accountId: number,
  ) {
    const account = await this.accountService.getAccountById(accountId);
    const kyc = await this.kycService.findMainKycByAccount(account);
    const buffer = await this.kycPdfHelperService.getKycArchiveWithPdfAsBuffer(kyc);

    if (!kyc.fileName) {
       throw new KycExceptions.KYCFileNotExists();
    }

    const archiveFileName = KycService.generateArchiveFileName(kyc.fileName);
    response.setHeader('Content-Disposition', `attachment; filename=${archiveFileName}`);

    response.send(buffer);
  }

  @Put(':accountId/kyc')
  @AccountAccessParam('accountId')
  @UseGuards(AuthorizedGuardAmlOfficerHttp)
  @ApiOperation({title: 'Change KYC status'})
  @ApiUseTags('Admin')
  async changeKycStatus(
    @Param('accountId', new ParseIntPipe()) accountId: number,
    @Session() session: IAccountSession,
    @Body() status: InKycChangeStatusDto,
  ) {
    const adminAccount = await this.accountService.getAccountById(session.accountId);
    const account = await this.accountService.getAccountById(accountId);

    return await this.kycService.changeStatus(adminAccount, account, status);
  }

  // endregion

  // region Users methods

  @Get(':accountId/kyc/reason')
  @AccountAccessParam('accountId')
  @ApiOperation({title: 'Get KYC reject reason'})
  async getRejectReason(
    @Param('accountId', new ParseIntPipe()) accountId: number,
    @Session() session: IAccountSession,
  ) {
    AccountAccessGuard.verifyAccess(accountId, session);

    const account = await this.accountService.getAccountById(accountId);
    return await this.kycService.getKycStatusDTO(account);
  }

  @Post(':accountId/kyc/reason')
  @AccountAccessParam('accountId')
  @ApiOperation({title: 'Reject reason was reading'})
  async rejectReasonWasReading(
    @Param('accountId', new ParseIntPipe()) accountId: number,
    @Session() session: IAccountSession,
  ) {
    throw new ForbiddenException(); // now no use
    // AccountAccessGuard.verifyAccess(accountId, session);
    //
    // return await this.kycService.resetRejectStatus(accountId);
  }

  @Get('kyc/state')
  @UseGuards(AuthorizedGuardHttp)
  @ApiOperation({ title: 'Get KYC state' })
  async getKycState(
    @Session() session: IAccountSession,
  ): Promise<any> {
    const account = await this.accountService.getAccountById(session.accountId);
    if (!account.kyc) {
      return undefined;
    }

    return account.kyc.frontendState;
  }

  @Post('kyc/state')
  @UseGuards(AuthorizedGuardHttp)
  @ApiOperation({ title: 'Set KYC state' })
  async setKycState(
    @Session() session: IAccountSession,
    @Body() body: any,
  ): Promise<any> {
    const account = await this.accountService.getAccountById(session.accountId);
    const kyc = await this.kycService.setKycState(account, body);

    return kyc.frontendState;
  }

  @Get('/kyc/sumsub')
  @UseGuards(AuthorizedGuardHttp)
  @ApiOperation({title: 'Get KYC info from SumSub'})
  @ApiResponse({ status: 200, type: OutKycInfoFromSumsubDTO })
  async getKycInfoForCurrentUserFromSumSub(
    @Session() session: IAccountSession,
  ): Promise<OutKycInfoFromSumsubDTO> {
    const account = await this.accountService.getAccountById(session.accountId);
    return await this.kycService.getSumSubInfoByAccountId(account);
  }

  // endregion
}