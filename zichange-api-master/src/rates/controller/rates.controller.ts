import { Body, Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RatesMessagesToMaster } from '../const/rates.messages-to-master.enum';
import { InRatesUpdateRatesDTO } from '../dto/in.rates.update-rates.dto';
import { InRatesUpdateEurRatesDTO } from '../dto/in.rates.update-eur-rates.dto';
import { RatesServiceProviderBase } from '../service/rates.service.provider.base';

@Controller('rates_service')
@UsePipes(new ValidationPipe())
export class RatesController {
  constructor(
    protected readonly ratesService: RatesServiceProviderBase,
  ) { }

  @MessagePattern(RatesMessagesToMaster.UpdatedRates)
  updatedRates(@Body() dto: InRatesUpdateRatesDTO) {
    this.ratesService.updateRatesFromDTO(dto);
  }

  @MessagePattern(RatesMessagesToMaster.UpdatedEurRates)
  updatedEurRates(@Body() dto: InRatesUpdateEurRatesDTO) {
    this.ratesService.updateEurRatesFromDTO(dto);
  }
}