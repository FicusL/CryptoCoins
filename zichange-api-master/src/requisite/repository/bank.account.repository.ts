import {EntityRepository, FindManyOptions, Repository} from 'typeorm';
import {BankAccountEntity} from '../entity/bank.account.entity';
import {AccountEntity} from '../../account/entitiy/account.entity';

@EntityRepository(BankAccountEntity)
export class BankAccountRepository extends Repository<BankAccountEntity> {
  findByAccount(
    account: AccountEntity,
    options: FindManyOptions<BankAccountEntity> = { order: { creation: 'DESC' } },
  ): Promise<BankAccountEntity[]> {
    return this.findByAccountId(account.id);
  }

  findByAccountId(
    accountId: number,
    options: FindManyOptions<BankAccountEntity> = { order: { creation: 'DESC' } },
  ): Promise<BankAccountEntity[]> {
    return this.find({
      where: { account: { id: accountId } },
      ...options,
    });
  }
}