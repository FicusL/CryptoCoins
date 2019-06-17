import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { AccountEntity } from '../../account/entitiy/account.entity';
import * as crypto from 'crypto';
import { v4 as uuid } from 'uuid/v4';

@Entity({ name: 'api_keys' })
export class CounterpartyApiKeyEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @ManyToOne(type => AccountEntity)
  account: AccountEntity;

  @RelationId((entity: CounterpartyApiKeyEntity) => entity.account)
  accountId: number;

  @Column({ nullable: false })
  label: string;

  @Index()
  @Column({ unique: true, nullable: false })
  hashOfPublicKey: string;

  @Column({ nullable: false })
  firstSymbolsOfPublicKey: string;

  @Column({ unique: true, nullable: false })
  secretKey: string;

  @Column({ type: 'bigint', nullable: false, default: 0 })
  lastNonce: bigint;

  // region Public Methods

  static generatePublicKey() {
    const randomBytes = crypto.randomBytes(8).toString('base64');

    const publicKey = CounterpartyApiKeyEntity.createHash(randomBytes + uuid() + Date.now());
    const hash = CounterpartyApiKeyEntity.createHash(publicKey);

    return { publicKey, hash };
  }

  static generateSecretKey() {
    const randomBytes = crypto.randomBytes(8).toString('base64');
    return CounterpartyApiKeyEntity.createHash(randomBytes + uuid() + Date.now());
  }

  static createHash(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex');
  }

  // endregion
}