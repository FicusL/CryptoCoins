import { SettingKeyDtoType } from '../../../settings/abstract/setting.key-dto.type';

export class RealtimeMicroservicesUpdateSettingsDTO {
  params: SettingKeyDtoType;

  constructor(data?: RealtimeMicroservicesUpdateSettingsDTO) {
    if (!data) {
      return;
    }

    this.params = data.params;
  }
}