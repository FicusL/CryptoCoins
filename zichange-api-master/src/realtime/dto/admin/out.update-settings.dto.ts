import { SettingsKeys } from '../../../settings/const/settings.keys';
import { SettingKeyDtoType } from '../../../settings/abstract/setting.key-dto.type';
import { OutSettingsMinAmountsDTO } from '../../../settings/modules/min-amounts/dto/out.settings.min-amounts.dto';
import { OutSettingsBankAccountDTO } from '../../../settings/modules/bank-account/dto/out.settings.bank.account.dto';
import { OutSettingsCurrenciesDTO } from '../../../settings/modules/curencies/dto/out.settings.currencies.dto';
import { OutSettingsReferralDTO } from '../../../settings/modules/referral/dto/out.settings.referral.dto';

export class OutUpdateSettingsDTO {
  readonly key: SettingsKeys;
  readonly value: OutSettingsMinAmountsDTO | OutSettingsBankAccountDTO | OutSettingsCurrenciesDTO | OutSettingsReferralDTO;

  constructor(
    params: SettingKeyDtoType,
  ) {
    this.key = params.key;
    this.value = params.dto;
  }
}