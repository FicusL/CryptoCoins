import { IEvent } from '@nestjs/cqrs';
import { SettingKeyDtoType } from '../../abstract/setting.key-dto.type';

export class SettingsUpdateSettingsEvent implements IEvent {
  constructor(
    public readonly params: SettingKeyDtoType,
  ) { }
}