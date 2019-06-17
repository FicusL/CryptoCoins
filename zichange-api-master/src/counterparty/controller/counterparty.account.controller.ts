import { Body, Controller, FileFieldsInterceptor, Get, Param, Post, Req, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { InAccountCounterpartyLoginViaCodeDTO } from '../../account/dto/in.account.counterparty-login-via-code.dto';
import { CounterpartyAccountService } from '../service/counterparty.account.service';
import { AccountService } from '../../account/service/account.service';
import { OutCounterpartyCurrentStepDTO } from '../dto/out.counterparty.current-step.dto';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { InKycNaturalCreateJsonDto } from '../../kyc/dto/natural/parts/in.kyc.natural.create.json.dto';
import { OutKycDto } from '../../kyc/dto/out.kyc.dto';
import { AccountType } from '../../account/const/account.type.enum';
import { KycExceptions } from '../../kyc/const/kyc.exceptions';
import { KycService } from '../../kyc/service/kyc.service';
import { OutTransactionDTO } from '../../transaction/dto/transaction/out.transaction.dto';
import { InCounterpartyResendCodeDTO } from '../dto/in.counterparty.resend-code.dto';
import { CaptchaService } from '../../core/modules/captcha/captcha.service';
import { ActivationCodeAlreadySentException } from '../exceptions/activation-code-already-sent.exception';
import { OutCounterpartyEmailDTO } from '../dto/out.counterparty.email.dto';
import { KycCreateService } from '../../kyc/service/kyc.create.service';
import { IKycFiles } from '../../kyc/const/kyc.file.interfaces';

@Controller('account/counterparties')
@ApiUseTags('b2b')
export class CounterpartyAccountController {
  constructor(
    protected readonly counterpartyAccountService: CounterpartyAccountService,
    protected readonly accountService: AccountService,
    protected readonly kycService: KycService,
    protected readonly kycCreateService: KycCreateService,
    protected readonly captchaService: CaptchaService,
  ) { }

  @Get(':token/step')
  @ApiOperation({ title: 'Get current step for b2b transaction' })
  @ApiResponse({ status: 200, type: OutCounterpartyCurrentStepDTO })
  async getCurrentStep(
    @Param('token') token: string,
  ): Promise<OutCounterpartyCurrentStepDTO> {
    const transaction = await this.counterpartyAccountService.getTransactionByCounterpartyActivationToken(token);

    const step = await this.counterpartyAccountService.getCurrentStep(transaction);
    return { step };
  }

  @Post(':token/send_code')
  @ApiOperation({ title: 'Send activation code for b2b transaction' })
  async sendCode(
    @Param('token') token: string,
  ): Promise<void> {
    const transaction = await this.counterpartyAccountService.getTransactionByCounterpartyActivationToken(token);
    if (transaction.counterpartyActivationCode) {
      throw new ActivationCodeAlreadySentException();
    }

    const account = await this.accountService.getAccountById(transaction.accountId);

    await this.counterpartyAccountService.sendCode(transaction, account.email);
  }

  @Post(':token/resend_code')
  @ApiOperation({ title: 'Resend activation code for b2b transaction' })
  async resendCode(
    @Req() request,
    @Param('token') token: string,
    @Body() dto: InCounterpartyResendCodeDTO,
  ): Promise<void> {
    await this.captchaService.verifyCaptcha(request, dto.captcha);

    const transaction = await this.counterpartyAccountService.getTransactionByCounterpartyActivationToken(token);
    const account = await this.accountService.getAccountById(transaction.accountId);

    await this.counterpartyAccountService.sendCode(transaction, account.email);
  }

  @Post(':token/activate')
  @ApiOperation({ title: 'Activate b2b transaction' })
  @ApiResponse({ status: 200, type: OutCounterpartyCurrentStepDTO })
  async activateTransaction(
    @Param('token') token: string,
    @Body() dto: InAccountCounterpartyLoginViaCodeDTO,
  ): Promise<OutCounterpartyCurrentStepDTO> {
    let transaction = await this.counterpartyAccountService.getTransactionByCounterpartyActivationToken(token);

    transaction = await this.counterpartyAccountService.activateTransaction(transaction, dto.code);

    const step = await this.counterpartyAccountService.getCurrentStep(transaction);
    return { step };
  }

  @Get(':token/email')
  @ApiOperation({ title: 'Get email by token' })
  @ApiResponse({ status: 200, type: OutCounterpartyEmailDTO })
  async getEmail(
    @Param('token') token: string,
  ): Promise<OutCounterpartyEmailDTO> {
    const transaction = await this.counterpartyAccountService.getTransactionByCounterpartyActivationToken(token);
    this.counterpartyAccountService.verifyTransactionActivated(transaction);

    const account = await this.accountService.getAccountById(transaction.accountId);

    return { email: account.email };
  }

  @Post(':token/kyc/natural')
  @ApiOperation({ title: 'Send KYC for b2b transaction' })
  @ApiResponse({ status: 200, type: OutKycDto })
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'identityDocument', maxCount: 1 }, // front side
    { name: 'identityDocumentBack', maxCount: 1 }, // back side
    { name: 'selfie', maxCount: 1 },
  ]))
  async sendKYC(
    @Param('token') token: string,
    @Body() kycJSON: InKycNaturalCreateJsonDto,
    @UploadedFiles() files: IKycFiles,
  ): Promise<OutKycDto> {
    const transaction = await this.counterpartyAccountService.getTransactionByCounterpartyActivationToken(token);
    this.counterpartyAccountService.verifyTransactionActivated(transaction);

    const account = await this.accountService.getAccountById(transaction.accountId);

    if (account.type !== AccountType.Natural) {
      throw new KycExceptions.AccountTypeNotMatchEndpoint();
    }

    const dto = await InKycNaturalCreateJsonDto.parseDTO(kycJSON);

    const selfie = files.selfie ? files.selfie[0] : undefined;
    const documentFront = files.identityDocument ? files.identityDocument[0] : undefined;
    const documentBack = files.identityDocumentBack ? files.identityDocumentBack[0] : undefined;

    return await this.kycCreateService.createNatural(account, dto, { selfie, documentFront, documentBack });
  }

  @Get(':token/kyc')
  @ApiOperation({ title: 'Get KYC info' })
  @ApiResponse({ status: 200, type: OutKycDto })
  async getKyc(
    @Param('token') token: string,
  ): Promise<OutKycDto> {
    const transaction = await this.counterpartyAccountService.getTransactionByCounterpartyActivationToken(token);
    this.counterpartyAccountService.verifyTransactionActivated(transaction);

    const account = await this.accountService.getAccountById(transaction.accountId);

    if (!account.kyc) {
      throw new KycExceptions.KYCNotFound();
    }

    const sumSubInfo = await this.kycService.getSumSubInfoSafety(account.kyc);
    return new OutKycDto(account.kyc, sumSubInfo);
  }

  @Get(':token')
  @ApiOperation({ title: 'Get transaction' })
  @ApiResponse({ status: 200, type: OutTransactionDTO })
  async getTransaction(
    @Param('token') token: string,
  ): Promise<OutTransactionDTO> {
    const transaction = await this.counterpartyAccountService.getTransactionByCounterpartyActivationToken(token);
    this.counterpartyAccountService.verifyTransactionActivated(transaction);

    return new OutTransactionDTO(transaction);
  }
}