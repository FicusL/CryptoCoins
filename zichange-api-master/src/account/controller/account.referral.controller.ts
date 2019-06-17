import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Session, UseGuards} from '@nestjs/common';
import { AccountReferralService } from '../service/account.referral.service';
import { AuthorizedGuardAdminHttp } from '../../core/guard/authorized.guard.admin.http';
import { ApiUseTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AccountService } from '../service/account.service';
import { BigNumber } from 'bignumber.js';
import { InAccountReferralExchangeCommissionCoefficientDTO } from '../dto/referral/in-account-referral-exchange-commission-coefficient.dto';
import { AuthorizedGuardHttp } from '../../core/guard/authorized.guard.http';
import { IAccountSession } from '../abstract/account.session.interface';
import { OutAccountReferralsDTO } from '../dto/referral/out.account.referrals.dto';

@Controller()
export class AccountReferralController {
  constructor(
    private readonly accountReferralService: AccountReferralService,
    private readonly accountService: AccountService,
  ) { }

  @Get('account/referrals')
  @ApiOperation({title: 'Receive referrals'})
  @ApiResponse({ status: 200, type: OutAccountReferralsDTO })
  @UseGuards(AuthorizedGuardHttp)
  async getReferrals(
    @Session() session: IAccountSession,
  ): Promise<OutAccountReferralsDTO> {
    const referrals = await this.accountReferralService.getReferrals(session.accountId);
    return new OutAccountReferralsDTO(referrals.length);
  }

  @Post('referral/accounts/:accountId/enable')
  @ApiUseTags('Admin')
  @ApiOperation({title: 'Enable partner program for user'})
  @UseGuards(AuthorizedGuardAdminHttp)
  async enablePartnerProgram(
    @Param('accountId', new ParseIntPipe()) accountId: number,
  ) {
    const account = await this.accountService.getAccountById(accountId);
    return await this.accountReferralService.enablePartnerProgram(account);
  }

  @Delete('referral/accounts/:accountId/disable')
  @ApiUseTags('Admin')
  @ApiOperation({title: 'Disable partner program for user'})
  @UseGuards(AuthorizedGuardAdminHttp)
  async disablePartnerProgram(
    @Param('accountId', new ParseIntPipe()) accountId: number,
  ) {
    const account = await this.accountService.getAccountById(accountId);
    return await this.accountReferralService.disablePartnerProgram(account);
  }

  @Put('referral/accounts/:accountId/coefficient')
  @ApiUseTags('Admin')
  @ApiOperation({title: 'Set exchange commission coefficient for user'})
  @UseGuards(AuthorizedGuardAdminHttp)
  async setExchangeCommissionCoefficient(
    @Param('accountId', new ParseIntPipe()) accountId: number,
    @Body() body: InAccountReferralExchangeCommissionCoefficientDTO,
  ) {
    const coefficient = new BigNumber(body.exchangeCommissionCoefficient);
    const account = await this.accountService.getAccountById(accountId);
    return await this.accountReferralService.setExchangeCommissionCoefficient(account, coefficient);
  }

  @Post('/referral/become_referral/:token')
  @ApiOperation({title: 'Become referral'})
  @UseGuards(AuthorizedGuardHttp)
  async becomeReferral(
    @Param('token') token: string,
    @Session() session: IAccountSession,
  ) {
    const refer = await this.accountReferralService.getAccountByReferralToken(token);
    const referral = await this.accountService.getAccountById(session.accountId);

    return await this.accountReferralService.becomeReferral({ refer, referral });
  }
}