import { Controller, Param, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { AuthorizedGuardHttp } from '../../core/guard/authorized.guard.http';
import { IndexHistoryService } from '../service/index.history.service';
import { OutIndexHistoryItemDTO } from '../dto/out.index-history-item.dto';
import { IndexService } from '../service/index.service';

@Controller('indexes')
@ApiUseTags('Indexes History')
@UseGuards(AuthorizedGuardHttp)
export class IndexHistoryController {
  constructor(
    private readonly indexService: IndexService,
    private readonly indexHistoryService: IndexHistoryService,
  ) { }

  @Get(':indexTicker/history')
  @ApiOperation({title: 'Get history for index'})
  @ApiResponse({ status: 200, type: OutIndexHistoryItemDTO, isArray: true })
  async getHistoryForIndex(
    @Param('indexTicker') indexTicker: string,
  ): Promise<OutIndexHistoryItemDTO[]> {
    const index = await this.indexService.getIndexByTicker(indexTicker);
    return await this.indexHistoryService.getHistoryForIndex(index);
  }
}