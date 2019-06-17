import { SettingsBaseCurrenciesService } from '../settings.base.currencies.service';
import {Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingsRepository } from '../../../../repository/settings.repository';
import { SettingsKeys } from '../../../../const/settings.keys';
import { SettingsCurrenciesType } from '../../types/settings.currencies.type';
import { EventBus } from '@nestjs/cqrs';

@Injectable()
export class SettingsFiatCurrenciesService extends SettingsBaseCurrenciesService {
  constructor(
    @InjectRepository(SettingsRepository)
    settings: SettingsRepository,

    eventBus: EventBus,
  ) {
    super(settings, SettingsKeys.AvailableFiatCurrencies, eventBus);
  }

  protected async getDefault(): Promise<SettingsCurrenciesType> {
    return ['EUR'];
  }
}