import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { AuthorizedGuardHttp } from '../../core/guard/authorized.guard.http';
import { OutIndexDTO } from '../dto/out.index.dto';
import { IndexService } from '../service/index.service';
import { IndexRatesService } from '../service/index.rates.service';

@Controller('indexes')
@ApiUseTags('Indexes')
@UseGuards(AuthorizedGuardHttp)
export class IndexController {
  constructor(
    private readonly indexService: IndexService,
    private readonly indexRatesService: IndexRatesService,
  ) { }

  @Get()
  @ApiOperation({title: 'Get all index'})
  @ApiResponse({ status: 200, type: OutIndexDTO, isArray: true })
  async getAllIndexes(): Promise<OutIndexDTO[]> {
    const indexes = await this.indexService.getAllIndexes();
    return indexes.map(index => this.indexRatesService.getIndexDTO(index));
  }
}