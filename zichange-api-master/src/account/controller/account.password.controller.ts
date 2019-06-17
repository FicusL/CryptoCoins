import { Body, Controller, Get, Param, Post, Req, Session, UseGuards } from '@nestjs/common';
import { CaptchaService } from '../../core/modules/captcha/captcha.service';
import { AccountService } from '../service/account.service';
import { InAccountChangePasswordDTO } from '../dto/in.account.password.change.dto';
import { AuthorizedGuardHttp } from '../../core/guard/authorized.guard.http';
import { InAccountPasswordResetFinishDTO } from '../dto/in.account.password.reset.finish.dto';
import { InAccountPasswordResetDTO } from '../dto/in.account.password.reset.dto';
import { ApiUseTags } from '@nestjs/swagger';
import { IAccountSession } from '../abstract/account.session.interface';

@Controller('account')
export class AccountUpdatePasswordController {
  constructor(
    private readonly accountService: AccountService,
    private readonly captchaService: CaptchaService,
  ) { }

  @Post('/authorization/reset_password')
  @ApiUseTags('Authorization', 'Reset password')
  public async resetPassword(@Req() req, @Body() body: InAccountPasswordResetDTO, @Session() session) {
    await this.captchaService.verifyCaptcha(req, body.captcha);

    await this.accountService.requestResetPassword(body);
  }

  @Get('/authorization/reset_password/:token')
  @ApiUseTags('Authorization', 'Reset password')
  public async getResetPasswordTokenData(@Param() param) {
    const account = await this.accountService.getResetPasswordTokenData(param.token);
    return account.email;
  }

  @Post('/authorization/reset_password/:token')
  @ApiUseTags('Authorization', 'Reset password')
  public async resetPasswordFinish(@Param() param, @Body() body: InAccountPasswordResetFinishDTO) {
    await this.accountService.resetPasswordFinish(param.token, body.password);
  }

  @Post('/authorization/reset_password/:token/login')
  public async loginByResetToken(
    @Param() param,
    @Session() session: IAccountSession,
  ) {
    const account = await this.accountService.loginByResetToken(param.token);
    this.accountService.attachSessionToAccount(session, account);
  }

  @Post('/settings/change_password')
  @UseGuards(AuthorizedGuardHttp)
  @ApiUseTags('Settings')
  public async changePassword(@Body() body: InAccountChangePasswordDTO, @Session() session) {
    const account = await  this.accountService.getAccountById(session.accountId);
    await this.accountService.updatePassword(account, body.oldPassword, body.newPassword, body.code);
  }
}