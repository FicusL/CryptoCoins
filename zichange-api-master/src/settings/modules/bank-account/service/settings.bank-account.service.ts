import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingsRepository } from '../../../repository/settings.repository';
import { OutSettingsBankAccountDTO } from '../dto/out.settings.bank.account.dto';
import { IBankAccount } from '../../../../core/abstract/core.bank.account.interface';
import { SettingsKeys } from '../../../const/settings.keys';
import { EventBus } from '@nestjs/cqrs';
import { SettingsUpdateSettingsEvent } from '../../../events/impl/settings.update-settings.event';

@Injectable()
export class SettingsBankAccountService {
  constructor(
    @InjectRepository(SettingsRepository)
    private readonly settingsRepository: SettingsRepository,

    protected readonly eventBus: EventBus,
  ) { }

  async get(): Promise<IBankAccount> {
    return await this.settingsRepository.findKey<IBankAccount>(SettingsKeys.BankAccount) || this.getDefault();
  }

  async update(value: Partial<IBankAccount>): Promise<OutSettingsBankAccountDTO> {
    const bankAccount = await this.get();

    const result = await this.settingsRepository.save<IBankAccount>(SettingsKeys.BankAccount, Object.assign(bankAccount, value));
    this.onUpdate(result);

    return new OutSettingsBankAccountDTO(result);
  }

  protected getDefault(): IBankAccount {
    return {
      label: '',
      bankName: '',
      BIC: '',
      currency: '',
      IBAN: '',
      recipientName: '',
    };
  }

  protected onUpdate(bankAccount: IBankAccount) {
    const dto = new OutSettingsBankAccountDTO(bankAccount);

    this.eventBus.publish(new SettingsUpdateSettingsEvent({
      key: SettingsKeys.BankAccount,
      dto,
    }));
  }
}