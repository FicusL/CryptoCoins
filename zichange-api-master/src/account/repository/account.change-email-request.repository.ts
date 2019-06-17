import { EntityRepository, Repository } from 'typeorm';
import { AccountChangeEmailRequestEntity } from '../entitiy/account.change-email.request.entity';

@EntityRepository(AccountChangeEmailRequestEntity)
export class AccountChangeEmailRequestRepository extends Repository<AccountChangeEmailRequestEntity> {
  async findByToken(token: string): Promise<AccountChangeEmailRequestEntity | undefined> {
    return await this.findOne({
      where: {
        activationToken: token,
      },
    });
  }
}