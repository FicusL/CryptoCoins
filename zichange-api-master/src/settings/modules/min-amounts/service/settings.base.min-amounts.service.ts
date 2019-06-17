import { SettingsRepository } from '../../../repository/settings.repository';
import { SettingsKeys } from '../../../const/settings.keys';
import { BigNumber } from 'bignumber.js';
import { SettingsMinAmountsMap } from '../types/settings.min-amounts-map.type';
import { SettingsMinAmountsObject } from '../types/settings.min-amounts-object.type';
import { SettingsMinAmountsConverter } from '../settings.min.amounts.converter';
import { EventBus } from '@nestjs/cqrs';
import { SettingsUpdateSettingsEvent } from '../../../events/impl/settings.update-settings.event';

type AvailableKeys =
  SettingsKeys.DepositMinAmount |
  SettingsKeys.ExchangeMinAmount |
  SettingsKeys.WithdrawalMinAmount;

export abstract class SettingsBaseMinAmountsService {
  protected constructor(
    private readonly settingsRepository: SettingsRepository,
    private readonly key: AvailableKeys,
    protected readonly eventBus: EventBus,
  ) { }

  getDefault(): SettingsMinAmountsMap {
    return new Map([
      ['EUR', new BigNumber('100')],
      ['BTC', new BigNumber('0.0015')],
      ['ZCN', new BigNumber('0')],
      ['ETH', new BigNumber('0')],
    ]);
  }

  async get(): Promise<SettingsMinAmountsMap> {
    const raw = await this.settingsRepository.findKey<SettingsMinAmountsObject>(this.key);
    if (!raw || Object.keys(raw).length === 0) {
      return this.getDefault();
    }

    return SettingsMinAmountsConverter.convertFromObject(raw);
  }

  async update(values: SettingsMinAmountsMap) {
    const minDeposits = await this.get();
    const updatedDeposits = new Map([...minDeposits].concat([...values]));

    const resultRaw = await this.settingsRepository.save(this.key, SettingsMinAmountsConverter.convertToObject(updatedDeposits));
    const result = SettingsMinAmountsConverter.convertFromObject(resultRaw);

    this.onUpdate(result);
    return result;
  }

  protected async onUpdate(values: SettingsMinAmountsMap) {
    const dto = SettingsMinAmountsConverter.convertToObject(values);

    this.eventBus.publish(new SettingsUpdateSettingsEvent({
      key: this.key,
      dto,
    }));
  }
}