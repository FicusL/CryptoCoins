import { CounterpartyApiKeyEntity } from '../entity/counterparty.api-key.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(CounterpartyApiKeyEntity)
export class CounterpartyApiKeyRepository extends Repository<CounterpartyApiKeyEntity> {
  getById(apiKeyId: number): Promise<CounterpartyApiKeyEntity | undefined> {
    return this.findOne({
      where: {
        id: apiKeyId,
      },
    });
  }

  getByAccountId(accountId: number) {
    return this.find({
      where: {
        account: {
          id: accountId,
        },
      },
    });
  }

  deleteById(apiKeyId: number) {
    return this.delete({
      id: apiKeyId,
    });
  }

  getByPublicKeyHash(hash: string) {
    return this.findOne({
      hashOfPublicKey: hash,
    });
  }
}