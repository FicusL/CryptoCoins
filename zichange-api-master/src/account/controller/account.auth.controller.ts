import { Body, Controller, Get, Param, Post, Req, Session, UseGuards } from '@nestjs/common';
import { InAccountDTO } from '../dto/in.account.dto';
import { CaptchaService } from '../../core/modules/captcha/captcha.service';
import { AccountService } from '../service/account.service';
import { LoggedInGuardHttp } from '../../core/guard/loggedin.guard.http';
import { ApiUseTags } from '@nestjs/swagger';
import { InAccountActivationResendDTO } from '../dto/in.account.activation.resend.dto';
import { IAccountSession } from '../abstract/account.session.interface';
import { InAccountRegisterDTO } from '../dto/in.account.register.dto';
import { OutAccountSessionDTO } from '../dto/out.acount.session.dto';
import { AccountEntity } from '../entitiy/account.entity';
import { AccountReferralService } from '../service/account.referral.service';

@Controller('account/authorization')
@ApiUseTags('Authorization')
export class AccountAuthController {
  constructor(
    private readonly accountService: AccountService,
    private readonly accountReferralService: AccountReferralService,
    private readonly captchaService: CaptchaService,
  ) { }

  @Post('/login')
  public async login(@Req() req, @Body() body: InAccountDTO, @Session() session: IAccountSession) {
    await this.captchaService.verifyCaptcha(req, body.captcha);

    const account = await this.accountService.login(body);
    this.accountService.attachSessionToAccount(session, account);
  }

  @Post('/logout')
  public async logout(@Session() session) {
    session.destroy();
  }

  @Get('/session')
  async session(@Session() session: IAccountSession): Promise<OutAccountSessionDTO> {
    return new OutAccountSessionDTO(await this.accountService.refreshSession(session));
  }

  @Post('/register')
  @ApiUseTags('Registration')
  public async register(@Req() req, @Body() body: InAccountRegisterDTO, @Session() session) {
    await this.captchaService.verifyCaptcha(req, body.captcha);

    let refer: AccountEntity | undefined;

    if (body.referralToken) {
      refer = await this.accountReferralService.getAccountByReferralToken(body.referralToken);
    }

    const account = await this.accountService.register(body);
    this.accountService.attachSessionToAccount(session, account);

    if (refer) {
      await this.accountReferralService.becomeReferral({ refer, referral: account });
    }
  }

  @Post('/register/resend_activation')
  @UseGuards(LoggedInGuardHttp)
  @ApiUseTags('Registration')
  public async resendActivation(@Req() req, @Session() session, @Body() body: InAccountActivationResendDTO) {
    await this.captchaService.verifyCaptcha(req, body.captcha);

    const account = await this.accountService.getAccountById(session.accountId);
    return await this.accountService.sendActivation(account);
  }

  @Post('/register/activate/:token')
  @ApiUseTags('Registration')
  public async activate(@Param() params, @Session() session) {
    const account = await this.accountService.activate(params.token);

    const isAuthorized = session && session.accountId && session.accountId === account.id;
    if (isAuthorized) {
      session.isActivated = account.isActivated;
    }
  }
}