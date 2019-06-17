import { ISession } from 'connect-typeorm';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { Bigint } from 'typeorm-static';

@Entity({ name: 'sessions' })
export class Session implements ISession {
  @PrimaryColumn('varchar', { length: 255 })
  id = '';

  @Index()
  @Column('bigint', { transformer: Bigint })
  expiredAt = Date.now();

  @Column('text')
  json = '';
}