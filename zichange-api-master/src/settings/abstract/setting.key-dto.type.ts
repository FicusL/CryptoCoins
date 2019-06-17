import { SettingsKeys } from '../const/settings.keys';
import { OutSettingsMinAmountsDTO } from '../modules/min-amounts/dto/out.settings.min-amounts.dto';
import { OutSettingsBankAccountDTO } from '../modules/bank-account/dto/out.settings.bank.account.dto';
import { OutSettingsCurrenciesDTO } from '../modules/curencies/dto/out.settings.currencies.dto';
import { OutSettingsReferralDTO } from '../modules/referral/dto/out.settings.referral.dto';

export type SettingKeyDtoType = {
  readonly key: SettingsKeys.DepositMinAmount | SettingsKeys.WithdrawalMinAmount | SettingsKeys.ExchangeMinAmount;
  readonly dto: OutSettingsMinAmountsDTO;
} | {
  readonly key: SettingsKeys.BankAccount;
  readonly dto: OutSettingsBankAccountDTO;
} | {
  readonly key: SettingsKeys.AvailableCryptoCurrencies | SettingsKeys.AvailableFiatCurrencies;
  readonly dto: OutSettingsCurrenciesDTO;
} | {
  readonly key: SettingsKeys.Referral;
  readonly dto: OutSettingsReferralDTO;
};