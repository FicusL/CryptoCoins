import { Body, Controller, Post, Session, UseGuards } from '@nestjs/common';
import { AccountService } from '../service/account.service';
import { InAccount2FAToggleDTO } from '../dto/in.account.2fa.toggle.dto';
import { LoggedInGuardHttp } from '../../core/guard/loggedin.guard.http';
import { AuthorizedGuardHttp } from '../../core/guard/authorized.guard.http';
import { ApiUseTags } from '@nestjs/swagger';
import { InAccount2FAAuthDTO } from '../dto/in.account.2fa.auth.dto';
import { IAccountSession } from '../abstract/account.session.interface';
import { Account2FAService } from '../service/account.2fa.service';

@Controller('account')
export class Account2FAController {
  constructor(
    private readonly accountService: AccountService,
    private readonly account2FAService: Account2FAService,
  ) { }

  @Post('/authorization/2fa')
  @UseGuards(LoggedInGuardHttp)
  @ApiUseTags('Authorization')
  public async auth2FA(@Body() body: InAccount2FAAuthDTO, @Session() session: IAccountSession) {
    const account = await this.accountService.getAccountById(session.accountId);
    await this.account2FAService.verify2FA(account, body.code);
    session.isAuthorized = true;
  }

  @Post('/settings/2fa/generate')
  @UseGuards(AuthorizedGuardHttp)
  @ApiUseTags('Settings')
  public async generate2FA(@Session() session: IAccountSession) {
    const account = await this.accountService.getAccountById(session.accountId);
    return await this.account2FAService.generate2FA(account);
  }

  @Post('/settings/2fa/enable')
  @UseGuards(AuthorizedGuardHttp)
  @ApiUseTags('Settings')
  public async enable2FA(@Body() body: InAccount2FAToggleDTO, @Session() session: IAccountSession) {
    const account = await this.accountService.getAccountById(session.accountId);
    await this.account2FAService.enable2FA(account, body.password, body.code);
  }

  @Post('/settings/2fa/disable')
  @UseGuards(AuthorizedGuardHttp)
  @ApiUseTags('Settings')
  public async disable2FA(@Body() body: InAccount2FAToggleDTO, @Session() session: IAccountSession) {
    const account = await this.accountService.getAccountById(session.accountId);
    await this.account2FAService.disable2FA(account, body.password, body.code);
  }
}