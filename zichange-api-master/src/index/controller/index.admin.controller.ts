import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { AuthorizedGuardAdminHttp } from '../../core/guard/authorized.guard.admin.http';
import { InAddIndexDTO } from '../dto/in.add-index.dto';
import { OutIndexDTO } from '../dto/out.index.dto';
import { InAddIndexCurrencyDTO } from '../dto/in.add-index-currency.dto';
import { InChangeIndexCurrencyDTO } from '../dto/in.change-index-currency.dto';
import { InChangeIndexDTO } from '../dto/in.change-index.dto';
import { IndexService } from '../service/index.service';
import { IndexRatesService } from '../service/index.rates.service';

@Controller('admin/indexes')
@ApiUseTags('Admin Indexes')
@UseGuards(AuthorizedGuardAdminHttp)
export class IndexAdminController {
  constructor(
    private readonly indexService: IndexService,
    private readonly indexRatesService: IndexRatesService,
  ) { }

  // region Indexes

  @Post(':indexTicker')
  @ApiOperation({title: 'Add index'})
  @ApiResponse({ status: 200, type: OutIndexDTO })
  async addIndex(
    @Param('indexTicker') indexTicker: string,
    @Body() dto: InAddIndexDTO,
  ): Promise<OutIndexDTO> {
    const index = await this.indexService.addIndex(indexTicker, dto);
    return this.indexRatesService.getIndexDTO(index);
  }

  @Delete(':indexTicker')
  @ApiOperation({title: 'Delete index'})
  @ApiResponse({ status: 200 })
  async deleteIndex(
    @Param('indexTicker') indexTicker: string,
  ): Promise<void> {
    await this.indexService.deleteIndex(indexTicker);
  }

  @Patch(':indexTicker')
  @ApiOperation({title: 'Change index'})
  @ApiResponse({ status: 200, type: OutIndexDTO })
  async changeIndex(
    @Param('indexTicker') indexTicker: string,
    @Body() dto: InChangeIndexDTO,
  ): Promise<OutIndexDTO> {
    const index = await this.indexService.changeIndex(indexTicker, dto);
    return this.indexRatesService.getIndexDTO(index);
  }

  // endregion

  // region Currencies

  @Post(':indexTicker/currencies/:indexCurrency')
  @ApiOperation({title: 'Add currency to index'})
  @ApiResponse({ status: 200, type: OutIndexDTO })
  async addCurrencyToIndex(
    @Param('indexTicker') indexTicker: string,
    @Param('indexCurrency') indexCurrency: string,
    @Body() dto: InAddIndexCurrencyDTO,
  ): Promise<OutIndexDTO> {
    let index = await this.indexService.getIndexByTicker(indexTicker);
    index = await this.indexService.addCurrencyToIndex(index, indexCurrency, dto);
    return this.indexRatesService.getIndexDTO(index);
  }

  @Delete(':indexTicker/currencies/:indexCurrency')
  @ApiOperation({title: 'Delete index currency' })
  @ApiResponse({ status: 200, type: OutIndexDTO })
  async deleteCurrencyFromIndex(
    @Param('indexTicker') indexTicker: string,
    @Param('indexCurrency') indexCurrency: string,
  ): Promise<OutIndexDTO> {
    let index = await this.indexService.getIndexByTicker(indexTicker);
    index = await this.indexService.deleteCurrencyFromIndex(index, indexCurrency);
    return this.indexRatesService.getIndexDTO(index);
  }

  @Patch(':indexTicker/currencies/:indexCurrency')
  @ApiOperation({title: 'Update currency for index'})
  @ApiResponse({ status: 200, type: OutIndexDTO })
  async changeIndexCurrency(
    @Param('indexTicker') indexTicker: string,
    @Param('indexCurrency') indexCurrency: string,
    @Body() dto: InChangeIndexCurrencyDTO,
  ): Promise<OutIndexDTO> {
    let index = await this.indexService.getIndexByTicker(indexTicker);
    index = await this.indexService.changeIndexCurrency(index, indexCurrency, dto);
    return this.indexRatesService.getIndexDTO(index);
  }

  // endregion
}