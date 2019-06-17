import {EntityRepository, FindManyOptions, Repository} from 'typeorm';
import {CryptoWalletEntity} from '../entity/crypto.wallet.entity';
import {AccountEntity} from '../../account/entitiy/account.entity';

@EntityRepository(CryptoWalletEntity)
export class CryptoWalletRepository extends Repository<CryptoWalletEntity> {
  async findByAccount(
    account: AccountEntity,
    options: FindManyOptions<CryptoWalletEntity> = { order: { creation: 'DESC' } },
  ): Promise<CryptoWalletEntity[]> {
    return await this.findByAccountId(account.id);
  }

  async findByAccountId(
    accountId: number,
    options: FindManyOptions<CryptoWalletEntity> = { order: { creation: 'DESC' } },
  ): Promise<CryptoWalletEntity[]> {
    return await this.find({
      where: { account: { id: accountId } },
      ...options,
    });
  }
}