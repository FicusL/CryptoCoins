import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingsRepository } from '../../../repository/settings.repository';
import { SettingsKeys } from '../../../const/settings.keys';
import { SettingsCurrenciesType } from '../types/settings.currencies.type';
import { OutSettingsCurrenciesDTO } from '../dto/out.settings.currencies.dto';
import { EventBus } from '@nestjs/cqrs';
import { SettingsUpdateSettingsEvent } from '../../../events/impl/settings.update-settings.event';

type AvailableKeys =
  SettingsKeys.AvailableFiatCurrencies |
  SettingsKeys.AvailableCryptoCurrencies;

@Injectable()
export abstract class SettingsBaseCurrenciesService {
  protected constructor(
    @InjectRepository(SettingsRepository)
    private readonly settingsRepository: SettingsRepository,

    private readonly key: AvailableKeys,

    protected readonly eventBus: EventBus,
  ) { }

  protected async getDefault(): Promise<SettingsCurrenciesType> {
    return [];
  }

  async get() {
    const result = await this.settingsRepository.findKey<SettingsCurrenciesType>(this.key);
    if (!result || result.length === 0) {
      return await this.getDefault();
    }

    return result;
  }

  async update(value: SettingsCurrenciesType) {
    const result = await this.settingsRepository.save(this.key, value);
    this.onUpdate(result);
    return result;
  }

  async create(value: SettingsCurrenciesType) {
    const currencies = await this.get();
    const currenciesSet = new Set([...currencies, ...value]);

    return await this.update([...currenciesSet]);
  }

  async delete(value: SettingsCurrenciesType) {
    const currencies = await this.get();
    const newCurrencies = currencies.filter(item => !value.includes(item));
    return await this.update(newCurrencies);
  }

  protected onUpdate(currencies: string[]) {
    const dto = new OutSettingsCurrenciesDTO(currencies);

    this.eventBus.publish(new SettingsUpdateSettingsEvent({
      key: this.key,
      dto,
    }));
  }
}