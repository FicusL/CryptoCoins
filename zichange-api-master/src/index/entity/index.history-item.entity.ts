import { Column, Entity, ManyToOne, PrimaryColumn, RelationId } from 'typeorm';
import { IndexEntity } from './index.entity';
import { BigNumberValueTransformer } from '../../core/util/bignumber.value.transformer';
import { BigNumber } from 'bignumber.js';

@Entity({ name: 'indexes_history' })
export class IndexHistoryItemEntity {
  @PrimaryColumn({ nullable: false })
  date: Date;

  @ManyToOne(type => IndexEntity, { primary: true, nullable: false })
  index?: IndexEntity;

  @RelationId((historyItem: IndexHistoryItemEntity) => historyItem.index)
  indexId: number;

  @Column({type: 'decimal', nullable: false, default: '0', precision: 128, scale: 8, transformer: new BigNumberValueTransformer(8) })
  totalValueInEUR: BigNumber;

  @Column({type: 'decimal', nullable: false, default: '0', precision: 128, scale: 8, transformer: new BigNumberValueTransformer(8) })
  supply: BigNumber;
}