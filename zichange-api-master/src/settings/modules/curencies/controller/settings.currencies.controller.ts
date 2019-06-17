import { Body, Delete, Get, Post, Put, Session, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { IAccountSession } from '../../../../account/abstract/account.session.interface';
import { InSettingCurrenciesDTO } from '../dto/in.settings.currencies.dto';
import { AccountAccessGuard } from '../../../../core/guard/account.access.guard';
import { OutSettingsCurrenciesDTO } from '../dto/out.settings.currencies.dto';
import { SettingsBaseCurrenciesService } from '../service/settings.base.currencies.service';
import { AuthorizedGuardTraderHttp } from '../../../../core/guard/authorized.guard.trader.http';

export abstract class SettingsCurrenciesController {
  protected constructor(
    private readonly setting: SettingsBaseCurrenciesService,
  ) {}

  @Post()
  @UseGuards(AuthorizedGuardTraderHttp)
  @ApiOperation({title: 'Set currencies'})
  @ApiUseTags('Admin')
  async setBankAccountCurrencies(
    @Session() session: IAccountSession,
    @Body() bankAccountCurrencies: InSettingCurrenciesDTO,
  ) {
    AccountAccessGuard.verifyAccess(session.accountId, session);
    const result = await this.setting.update(bankAccountCurrencies.currencies);
    return new OutSettingsCurrenciesDTO(result);
  }

  @Put()
  @UseGuards(AuthorizedGuardTraderHttp)
  @ApiOperation({title: 'Add currencies'})
  @ApiUseTags('Admin')
  async addBankAccountCurrencies(
    @Session() session: IAccountSession,
    @Body() bankAccountCurrencies: InSettingCurrenciesDTO,
  ) {
    AccountAccessGuard.verifyAccess(session.accountId, session);
    const result = await this.setting.create(bankAccountCurrencies.currencies);
    return new OutSettingsCurrenciesDTO(result);
  }

  @Delete()
  @ApiUseTags('Admin')
  @UseGuards(AuthorizedGuardTraderHttp)
  @ApiOperation({title: 'Delete currencies'})
  @ApiResponse({ status: 200, type: OutSettingsCurrenciesDTO })
  async deleteBankAccountCurrencies(
    @Session() session: IAccountSession,
    @Body() bankAccountCurrencies: InSettingCurrenciesDTO,
  ): Promise<OutSettingsCurrenciesDTO> {
    AccountAccessGuard.verifyAccess(session.accountId, session);
    const result = await this.setting.delete(bankAccountCurrencies.currencies);
    return new OutSettingsCurrenciesDTO(result);
  }

  @Get()
  @ApiOperation({title: 'Get currencies'})
  @ApiResponse({ status: 200, type: OutSettingsCurrenciesDTO })
  async getBankAccountCurrencies(
    @Session() session: IAccountSession,
  ): Promise<OutSettingsCurrenciesDTO> {
    const result = await this.setting.get();
    return new OutSettingsCurrenciesDTO(result);
  }
}