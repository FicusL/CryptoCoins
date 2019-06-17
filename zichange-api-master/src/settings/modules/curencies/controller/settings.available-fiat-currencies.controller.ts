import {Controller} from '@nestjs/common';
import {ApiUseTags} from '@nestjs/swagger';
import {SettingsFiatCurrenciesService} from '../service/concrete/settings.fiat-currencies.service';
import {SettingsCurrenciesController} from './settings.currencies.controller';

@Controller('settings/available_currencies/fiat')
@ApiUseTags('API Settings. Available fiat currencies')
export class SettingsAvailableFiatCurrenciesController extends SettingsCurrenciesController {
  constructor(
    setting: SettingsFiatCurrenciesService,
  ) {
    super(setting);
  }
}