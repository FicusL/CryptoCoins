import { Body, Get, Post, Session, UseGuards } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { IAccountSession } from '../../../../account/abstract/account.session.interface';
import { SettingsBaseMinAmountsService } from '../service/settings.base.min-amounts.service';
import { InSettingsMinAmountsDTO } from '../dto/in.settings.min-amounts.dto';
import { OutSettingsMinAmountsDTO } from '../dto/out.settings.min-amounts.dto';
import { AuthorizedGuardTraderHttp } from '../../../../core/guard/authorized.guard.trader.http';
import { SettingsMinAmountsConverter } from '../settings.min.amounts.converter';
import { SettingsMinAmountsMap } from '../types/settings.min-amounts-map.type';
import { BigNumber } from 'bignumber.js';

export abstract class SettingsBaseMinAmountsController {
  protected constructor(
    private readonly service: SettingsBaseMinAmountsService,
  ) { }

  @Post()
  @ApiUseTags('Admin')
  @UseGuards(AuthorizedGuardTraderHttp)
  @ApiOperation({ title: 'Set min amount' })
  @ApiResponse({ status: HttpStatus.OK, type: OutSettingsMinAmountsDTO })
  async setMinAmounts(@Session() session: IAccountSession, @Body() body: InSettingsMinAmountsDTO): Promise<OutSettingsMinAmountsDTO> {
    const map: SettingsMinAmountsMap = new Map();
    map.set(body.currency, new BigNumber(body.amount));

    const result = await this.service.update(map);
    return SettingsMinAmountsConverter.convertToObject(result);
  }

  @Get()
  @ApiOperation({ title: 'Get min amount' })
  @ApiResponse({ status: HttpStatus.OK, type: OutSettingsMinAmountsDTO })
  async getMinAmounts(): Promise<OutSettingsMinAmountsDTO> {
    const result = await this.service.get();
    return SettingsMinAmountsConverter.convertToObject(result);
  }
}