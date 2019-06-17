import { Controller, UseGuards, Post, Delete, Param, ParseIntPipe, Body } from '@nestjs/common';
import { AuthorizedGuardAdminHttp } from '../../core/guard/authorized.guard.admin.http';
import { CounterpartyAdminService } from '../service/counterparty.admin.service';
import { AccountService } from '../../account/service/account.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OutCounterpartyAccountDTO } from '../dto/out.counterparty.account.dto';
import { InCounterpartyGetAccountsFilterDTO } from '../dto/in.counterparty.get-accounts-filter.dto';
import { OutCoreAmountDTO } from '../../core/dto/out.core.amount.dto';
import { CounterpartyService } from '../service/counterparty.service';

@Controller('admin')
@UseGuards(AuthorizedGuardAdminHttp)
export class CounterpartAdminController {
  constructor(
    protected readonly counterpartyAdminService: CounterpartyAdminService,
    protected readonly counterpartyService: CounterpartyService,
    protected readonly accountService: AccountService,
  ) { }

  // region Set Roles

  @Post('counterparties/:accountId')
  @ApiOperation({title: 'Set role: counterparty for account'})
  async createCounterparty(
    @Param('accountId', new ParseIntPipe()) accountId: number,
  ) {
    const account = await this.accountService.getAccountById(accountId);
    await this.counterpartyAdminService.createCounterparty(account);
  }

  @Delete('counterparties/:accountId')
  @ApiOperation({title: 'Delete role: counterparty for account'})
  async disableCounterparty(
    @Param('accountId', new ParseIntPipe()) accountId: number,
  ) {
    const account = await this.accountService.getAccountById(accountId);
    await this.counterpartyAdminService.disableCounterparty(account);
  }

  // endregion

  // region Accounts

  @Post('accounts')
  @ApiOperation({title: 'Get accounts with filters'})
  @ApiResponse({ status: 200, type: OutCounterpartyAccountDTO, isArray: true })
  async getAccounts(
    @Body() dto: InCounterpartyGetAccountsFilterDTO,
  ): Promise<OutCounterpartyAccountDTO[]> {
    return await this.counterpartyService.getAccounts(dto);
  }

  @Post('accounts/amount')
  @ApiOperation({ title: 'Get amount of accounts' })
  @ApiResponse({ status: 200, type: OutCoreAmountDTO })
  async getAccountsAmount(): Promise<OutCoreAmountDTO> {
    const amount = await this.accountService.getAmountOfAccounts();
    return { amount };
  }

  // endregion
}