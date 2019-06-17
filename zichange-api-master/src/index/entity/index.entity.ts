import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BigNumberValueTransformer } from '../../core/util/bignumber.value.transformer';
import { BigNumber } from 'bignumber.js';
import { IndexCurrencyEntity } from './index-currency.entity';

@Entity({ name: 'indexes' })
export class IndexEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ nullable: false, unique: true })
  ticker: string;

  @Column({ nullable: false })
  title: string;

  @Column({type: 'decimal', nullable: false, default: '0', precision: 128, scale: 8, transformer: new BigNumberValueTransformer(8) })
  supply: BigNumber;

  @OneToMany(type => IndexCurrencyEntity, currency => currency.index)
  currencies: IndexCurrencyEntity[] | undefined;

  constructor(entity?: IndexEntity) {
    if (!entity) {
      return;
    }

    Object.assign(this, entity);
  }
}