import { Controller, Get, Post } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { InviteCodesService } from '../service/invite-codes.service';
import { OutInviteCodeDTO } from '../dto/out.invite-code.dto';
import { AuthorizedGuardAdminHttp } from '../../core/guard/authorized.guard.admin.http';

@Controller('accounts/invite_codes')
export class InviteCodesController {
  constructor(
    private readonly service: InviteCodesService,
  ) { }

  @Get('is_enabled')
  isEnabled(): boolean {
    return InviteCodesService.IS_ENABLED;
  }

  @Post('generate')
  @UseGuards(AuthorizedGuardAdminHttp)
  async generateCode(): Promise<OutInviteCodeDTO> {
    return this.service.generateCode();
  }

  @Get()
  @UseGuards(AuthorizedGuardAdminHttp)
  async geAllCodes(): Promise<OutInviteCodeDTO[]> {
    return this.service.getAllCodes();
  }
}