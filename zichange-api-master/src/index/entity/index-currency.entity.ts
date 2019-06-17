import { Column, Entity, ManyToOne, PrimaryColumn, RelationId } from 'typeorm';
import { BigNumberValueTransformer } from '../../core/util/bignumber.value.transformer';
import { BigNumber } from 'bignumber.js';
import { IndexEntity } from './index.entity';

@Entity({ name: 'index_currencies' })
export class IndexCurrencyEntity {
  @ManyToOne(type => IndexEntity, index => index.currencies, { primary: true })
  index?: IndexEntity;

  @RelationId((currency: IndexCurrencyEntity) => currency.index)
  indexId: number;

  @PrimaryColumn({ nullable: false })
  currency: string;

  @Column({type: 'decimal', nullable: false, default: '0', precision: 128, scale: 8, transformer: new BigNumberValueTransformer(8) })
  balance: BigNumber;
}