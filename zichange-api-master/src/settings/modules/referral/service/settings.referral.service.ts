import { Injectable } from '@nestjs/common';
import { SettingsRepository } from '../../../repository/settings.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { BigNumber } from 'bignumber.js';
import { IReferralOptions } from '../types/referral-options.interface';
import { IReferralOptionsObject } from '../types/referral-options-object.interface';
import { SettingsKeys } from '../../../const/settings.keys';
import { SettingsReferralConverter } from '../settings.referral.converter';
import { SettingsUpdateSettingsEvent } from '../../../events/impl/settings.update-settings.event';
import { EventBus } from '@nestjs/cqrs';

@Injectable()
export class SettingsReferralService {
  private readonly key = SettingsKeys.Referral;

  constructor(
    @InjectRepository(SettingsRepository)
    private readonly settingsRepository: SettingsRepository,

    protected readonly eventBus: EventBus,
  ) { }

  async get(): Promise<IReferralOptions> {
    const raw = await this.settingsRepository.findKey<IReferralOptionsObject>(this.key);
    if (!raw || Object.keys(raw).length === 0) {
      return await this.getDefault();
    }

    return SettingsReferralConverter.convertFromObject(raw);
  }

  async update(newOptions: IReferralOptions) {
    const referralOptions = await this.get();

    const updatedReferralOptions = {
      ...referralOptions,
      ...newOptions,
    };

    const resultRaw = await this.settingsRepository.save(this.key, SettingsReferralConverter.convertToObject(updatedReferralOptions));
    const result = SettingsReferralConverter.convertFromObject(resultRaw);

    this.onUpdate(result);
    return result;
  }

  protected onUpdate(referralOptions: IReferralOptions) {
    const dto = SettingsReferralConverter.convertToObject(referralOptions);

    this.eventBus.publish(new SettingsUpdateSettingsEvent({
      key: this.key,
      dto,
    }));
  }

  protected getDefault(): IReferralOptions {
    return {
      exchangeCommissionCoefficient: new BigNumber('0.3'),
    };
  }
}