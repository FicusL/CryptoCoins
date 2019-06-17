import {AbstractRepository, EntityRepository} from 'typeorm';
import {SettingsEntity} from '../entity/settings.entity';
import {SettingsKeys} from '../const/settings.keys';

@EntityRepository(SettingsEntity)
export class SettingsRepository extends AbstractRepository<SettingsEntity> {
  async findKey<T extends object>(key: SettingsKeys, defaultValue?: T): Promise<T|undefined> {
    const entity = await this.repository.findOne({ where: { key } });
    if (!entity) {
      return defaultValue;
    }

    return entity.value as T;
  }

  async save<T extends object>(key: SettingsKeys, value: T): Promise<T> {
    let entity = await this.repository.findOne({ where: { key } });

    if (!entity) {
      entity = new SettingsEntity();
    }

    entity.key = key;
    entity.value = value;

    try {
      entity = await this.repository.save(entity);
    } catch (e) {
      await this.repository.update({key}, entity);
    }

    return entity.value as T;
  }
}