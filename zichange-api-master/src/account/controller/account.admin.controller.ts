import { AccountService } from '../service/account.service';
import { Body, Controller, Get, Param, ParseIntPipe, Post, Session, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { OutAccountShortDto } from '../dto/out.account.short.dto';
import { OutAccountFullDto } from '../dto/out.account.full.dto';
import { AuthorizedGuardAdminHttp } from '../../core/guard/authorized.guard.admin.http';
import { AuthorizedGuardTraderHttp } from '../../core/guard/authorized.guard.trader.http';
import { InAccountChangeRoleDTO } from '../dto/in.account.change-role.dto';

@Controller('admin/account')
@ApiUseTags('Dashboard')
export class AccountAdminController {
  constructor(
    private readonly accountService: AccountService,
  ) { }

  @Post(':accountId/roles')
  @ApiUseTags('Admin')
  @ApiOperation({title: 'Change account roles'})
  @UseGuards(AuthorizedGuardAdminHttp)
  @ApiResponse({ status: 200 })
  public async changeAccountRoles(
    @Body() dto: InAccountChangeRoleDTO,
    @Param('accountId', new ParseIntPipe()) accountId: number,
  ) {
    const account = await this.accountService.getAccountById(accountId);
    await this.accountService.changeAccountRoles(account, dto);
  }

  @Get(':accountId/full_info')
  @ApiUseTags('Admin')
  @ApiOperation({title: 'Get full info about user'})
  @UseGuards(AuthorizedGuardAdminHttp)
  @ApiResponse({ status: 200, type: OutAccountFullDto })
  public async getFullInfo(
    @Param('accountId', new ParseIntPipe()) accountId: number,
    @Session() session,
  ): Promise<OutAccountFullDto> {
    return await this.accountService.getAccountFullInfoDTO(accountId);
  }

  @Get('/list/short')
  @ApiUseTags('Admin')
  @ApiOperation({title: 'Get all users. Short'})
  @UseGuards(AuthorizedGuardTraderHttp)
  @ApiResponse({ status: 200, type: OutAccountShortDto })
  async getAllUsersShort(): Promise<OutAccountShortDto[]> {
    return await this.accountService.getAllUsersShort();
  }

  @Get('/list/full')
  @ApiUseTags('Admin')
  @ApiOperation({title: 'Get all users. Full'})
  @UseGuards(AuthorizedGuardAdminHttp)
  @ApiResponse({ status: 200, type: OutAccountFullDto })
  async getAllUsersFull(): Promise<OutAccountFullDto[]> {
    return await this.accountService.getAllUsersFull();
  }

  @Get('wallets/:cryptoWallet/currencies/:currency')
  @ApiUseTags('Admin')
  @ApiOperation({ title: 'Find account by crypto wallet' })
  @UseGuards(AuthorizedGuardTraderHttp)
  @ApiResponse({ status: 200, type: OutAccountShortDto })
  async getAccountByCryptoWallet(
    @Param('cryptoWallet') cryptoWallet: string,
    @Param('currency') currency: string,
  ): Promise<OutAccountShortDto> {
    const account = await this.accountService.getAccountByCryptoWallet(cryptoWallet, currency);
    return new OutAccountShortDto(account, []);
  }
}