import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SettingsKeys } from '../const/settings.keys';

@Entity({ name: 'settings' })
export class SettingsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: SettingsKeys, unique: true})
  key: SettingsKeys;

  @Column({type: 'jsonb'})
  value: object;
}