import { Body, Controller, Param, Post, Session, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { AuthorizedGuardHttp } from '../../core/guard/authorized.guard.http';
import { IAccountSession } from '../abstract/account.session.interface';
import { AccountChangeEmailService } from '../service/account.change-email.service';
import { InAccountChangeEmailDTO } from '../dto/in.account.change-email.dto';
import { Account2FAService } from '../service/account.2fa.service';
import { AccountService } from '../service/account.service';

@Controller('accounts/email')
@ApiUseTags('Account email')
export class AccountChangeEmailController {
  constructor(
    private readonly accountService: AccountService,
    private readonly account2FAService: Account2FAService,
    private readonly accountChangeEmailService: AccountChangeEmailService,
  ) { }

  @Post('change')
  @ApiOperation({title: 'Change email'})
  @UseGuards(AuthorizedGuardHttp)
  async changeEmail(
    @Session() session: IAccountSession,
    @Body() dto: InAccountChangeEmailDTO,
  ) {
    const account = await this.accountService.getAccountById(session.accountId);
    await this.account2FAService.verify2FA(account, dto.code2fa);

    await this.accountChangeEmailService.changeEmail(account, dto.newEmail);
  }

  @Post('change/:token')
  @ApiOperation({title: 'Activate new email'})
  async activateNewEmail(
    @Param('token') token: string,
  ) {
    await this.accountChangeEmailService.activateNewEmail(token);
  }
}