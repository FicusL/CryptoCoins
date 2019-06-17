import { Controller } from '@nestjs/common';
import { SettingsBaseMinAmountsController } from './settings.base.min-amounts.controller';
import { SettingsDepositMinAmountService } from '../service/concrete/settings.deposit-min-amount.service';

@Controller('settings/min_amounts/deposit')
export class SettingsDepositMinAmountsController extends SettingsBaseMinAmountsController{
  constructor(
    service: SettingsDepositMinAmountService,
  ) {
    super(service);
  }
}