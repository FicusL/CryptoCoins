import {Controller} from '@nestjs/common';
import {ApiUseTags} from '@nestjs/swagger';
import {SettingsCryptoCurrenciesService} from '../service/concrete/settings.crypto-currencies.service';
import {SettingsCurrenciesController} from './settings.currencies.controller';

@Controller('settings/available_currencies/crypto')
@ApiUseTags('API Settings. Available crypto currencies')
export class SettingsAvailableCryptoCurrenciesController extends SettingsCurrenciesController {
  constructor(
    setting: SettingsCryptoCurrenciesService,
  ) {
    super(setting);
  }
}