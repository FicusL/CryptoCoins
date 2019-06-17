import { Controller, Get, Param, ParseIntPipe, Response } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CounterpartyService } from '../service/counterparty.service';
import { CounterpartyLogoIsAbsentException } from '../exceptions/counterparty-logo-is-absent.exception';
import { OutCounterpartyUrlDTO } from '../dto/out.counterparty.url.dto';

@Controller('counterparties')
export class CounterpartyInfoController {
  constructor(
    protected readonly counterpartyService: CounterpartyService,
  ) { }

  // region Styles

  @Get(':accountId/styles')
  @ApiOperation({title: 'Get counterparty styles'})
  async getStyles(
    @Param('accountId', new ParseIntPipe()) accountId: number,
  ) {
    const counterparty = await this.counterpartyService.getCounterpartyByAccountId(accountId);
    return counterparty.styles;
  }

  // endregion

  // region Logo

  @Get(':accountId/logo')
  @ApiOperation({title: 'Get counterparty logo'})
  async getLogo(
    @Param('accountId', new ParseIntPipe()) accountId: number,
    @Response() response,
  ) {
    const counterparty = await this.counterpartyService.getCounterpartyByAccountId(accountId);

    if (!counterparty.logo) {
      throw new CounterpartyLogoIsAbsentException();
    }

    response.setHeader('Content-Disposition', `attachment; filename=logo.${counterparty.logoExt}`);
    response.send(counterparty.logo);
  }

  // endregion

  // region Url

  @Get(':accountId/url')
  @ApiOperation({title: 'Get counterparty url by counterparty Id'})
  @ApiResponse({ status: 200, type: OutCounterpartyUrlDTO })
  async getCounterpartyUrl(
    @Param('accountId', new ParseIntPipe()) accountId: number,
  ): Promise<OutCounterpartyUrlDTO> {
    const counterparty = await this.counterpartyService.getCounterpartyByAccountId(accountId);
    return { url: counterparty.url };
  }

  // endregion
}