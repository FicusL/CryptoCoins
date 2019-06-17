import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { AccountEntity } from '../../account/entitiy/account.entity';

@Entity({ name: 'counterparties' })
export class CounterpartyEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @OneToOne(type => AccountEntity, { nullable: false, cascade: true })
  @JoinColumn()
  account: AccountEntity;

  @RelationId((entity: CounterpartyEntity) => entity.account)
  accountId: number;

  @Column({ type: 'jsonb', nullable: true })
  styles?: object;

  @Column({ type: 'bytea', nullable: true })
  logo?: Buffer;

  @Column({ nullable: true })
  logoExt?: string;

  @Column({ type: 'jsonb', nullable: false, default: [] })
  whiteListIPs: string[];

  @Column({ nullable: false, default: false })
  useWhiteListIPs: boolean;

  @Column({ nullable: true })
  url?: string;

  @Column({ nullable: true })
  letterTextFooter?: string;
}