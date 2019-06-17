import { Body, Controller, Get, Post, Session, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { IAccountSession } from '../../../../account/abstract/account.session.interface';
import { InSettingsBankAccountDTO } from '../dto/in.settings.bank.account.dto';
import { AccountAccessGuard } from '../../../../core/guard/account.access.guard';
import { OutSettingsBankAccountDTO } from '../dto/out.settings.bank.account.dto';
import { SettingsBankAccountService } from '../service/settings.bank-account.service';
import { AuthorizedGuardTraderHttp } from '../../../../core/guard/authorized.guard.trader.http';

@Controller('settings/bank_account')
@ApiUseTags('API Settings')
export class SettingsBankAccountController {
  constructor(
    private readonly settingService: SettingsBankAccountService,
  ) { }

  @Post()
  @UseGuards(AuthorizedGuardTraderHttp)
  @ApiOperation({title: 'Set bank account information'})
  @ApiUseTags('Admin')
  @ApiResponse({ status: 200, type: OutSettingsBankAccountDTO })
  async setBankAccount(
    @Session() session: IAccountSession,
    @Body() bankAccount: InSettingsBankAccountDTO,
  ): Promise<OutSettingsBankAccountDTO> {
    AccountAccessGuard.verifyAccess(session.accountId, session);
    return new OutSettingsBankAccountDTO(await this.settingService.update(bankAccount));
  }

  @Get()
  @UseGuards(AuthorizedGuardTraderHttp)
  @ApiOperation({title: 'Get bank account information'})
  @ApiUseTags('Admin')
  @ApiResponse({ status: 200, type: OutSettingsBankAccountDTO })
  async getBankAccount(
    @Session() session: IAccountSession,
  ): Promise<OutSettingsBankAccountDTO> {
    AccountAccessGuard.verifyAccess(session.accountId, session);
    return new OutSettingsBankAccountDTO(await this.settingService.get());
  }
}