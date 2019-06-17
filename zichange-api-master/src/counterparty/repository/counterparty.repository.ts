import { EntityRepository, Repository } from 'typeorm';
import { CounterpartyEntity } from '../entity/counterparty.entity';

@EntityRepository(CounterpartyEntity)
export class CounterpartyRepository extends Repository<CounterpartyEntity> {
  getByAccountId(accountId: number): Promise<CounterpartyEntity | undefined> {
    return this.findOne({
      where: {
        account: {
          id: accountId,
        },
      },
    });
  }

  deleteByAccountId(accountId: number) {
    return this.delete({
      account: {
        id: accountId,
      },
    });
  }
}