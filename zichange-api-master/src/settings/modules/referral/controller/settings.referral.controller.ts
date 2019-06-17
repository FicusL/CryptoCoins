import { Body, Controller, Get, HttpStatus, Post, Session, UseGuards } from '@nestjs/common';
import { ApiOperation , ApiResponse, ApiUseTags} from '@nestjs/swagger';
import { SettingsReferralService } from '../service/settings.referral.service';
import { AuthorizedGuardAdminHttp } from '../../../../core/guard/authorized.guard.admin.http';
import { IAccountSession } from '../../../../account/abstract/account.session.interface';
import { InSettingsReferralDTO } from '../dto/in.settings.referral.dto';
import { OutSettingsReferralDTO } from '../dto/out.settings.referral.dto';
import { SettingsReferralConverter } from '../settings.referral.converter';

@Controller('settings/referral')
export class SettingsReferralController {
  constructor(
    private readonly service: SettingsReferralService,
  ) { }

  @Post()
  @ApiUseTags('Admin')
  @UseGuards(AuthorizedGuardAdminHttp)
  @ApiOperation({ title: 'Set referral options' })
  @ApiResponse({ status: HttpStatus.OK, type: OutSettingsReferralDTO })
  async setMinAmounts(
    @Session() session: IAccountSession,
    @Body() body: InSettingsReferralDTO,
  ): Promise<OutSettingsReferralDTO> {
    const data = SettingsReferralConverter.convertFromObject(body);
    const result = await this.service.update(data);
    return SettingsReferralConverter.convertToObject(result);
  }

  @Get()
  @ApiOperation({ title: 'Get referral options' })
  @ApiResponse({ status: HttpStatus.OK, type: OutSettingsReferralDTO })
  async getMinAmounts(): Promise<OutSettingsReferralDTO> {
    const result = await this.service.get();
    return new OutSettingsReferralDTO(SettingsReferralConverter.convertToObject(result));
  }
}