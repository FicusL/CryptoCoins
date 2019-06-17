import { Controller } from '@nestjs/common';
import { SettingsBaseMinAmountsController } from './settings.base.min-amounts.controller';
import { SettingsWithdrawalMinAmountService } from '../service/concrete/settings.withdrawal-min-amount.service';

@Controller('settings/min_amounts/withdrawal')
export class SettingsWithdrawalMinAmountsController extends SettingsBaseMinAmountsController{
  constructor(
    service: SettingsWithdrawalMinAmountService,
  ) {
    super(service);
  }
}