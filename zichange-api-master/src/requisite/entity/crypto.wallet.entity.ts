import {BaseRequisiteEntity} from './base.requisite.entity';
import {Column, Entity} from 'typeorm';

@Entity({ name: 'crypto_wallets' })
export class CryptoWalletEntity extends BaseRequisiteEntity {
  @Column()
  address: string;
}