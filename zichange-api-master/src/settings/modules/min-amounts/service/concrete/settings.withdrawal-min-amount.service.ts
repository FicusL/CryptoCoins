import { SettingsBaseMinAmountsService } from '../settings.base.min-amounts.service';
import { SettingsRepository } from '../../../../repository/settings.repository';
import { SettingsKeys } from '../../../../const/settings.keys';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

@Injectable()
export class SettingsWithdrawalMinAmountService extends SettingsBaseMinAmountsService {
  constructor(
    @InjectRepository(SettingsRepository)
    settingsRepository: SettingsRepository,

    eventBus: EventBus,
  ) {
    super(settingsRepository, SettingsKeys.WithdrawalMinAmount, eventBus);
  }
}