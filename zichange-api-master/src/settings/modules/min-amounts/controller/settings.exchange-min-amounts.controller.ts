import { Controller } from '@nestjs/common';
import { SettingsBaseMinAmountsController } from './settings.base.min-amounts.controller';
import { SettingsExchangeMinAmountService } from '../service/concrete/settings.exchange-min-amount.service';

@Controller('settings/min_amounts/exchange')
export class SettingsExchangeMinAmountsController extends SettingsBaseMinAmountsController{
  constructor(
    service: SettingsExchangeMinAmountService,
  ) {
    super(service);
  }
}