import { AccountService } from '../service/account.service';
import { Controller, Get, Session, UseGuards } from '@nestjs/common';
import { AuthorizedGuardHttp } from '../../core/guard/authorized.guard.http';
import { ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { OutAccountDTO } from '../dto/out.account.dto';

@Controller('account')
@ApiUseTags('Dashboard')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
  ) { }

  @Get('/')
  @UseGuards(AuthorizedGuardHttp)
  @ApiResponse({ status: 200, type: OutAccountDTO })
  public async account(@Session() session): Promise<OutAccountDTO> {
    const account = await this.accountService.getAccountById(session.accountId);
    return await this.accountService.getAccountData(account);
  }
}