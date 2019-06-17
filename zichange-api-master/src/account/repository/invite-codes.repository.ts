import { EntityRepository, Repository } from 'typeorm';
import { InviteCodeEntity } from '../entitiy/invite-code.entity';
import { FindConditions } from 'typeorm';

@EntityRepository(InviteCodeEntity)
export class InviteCodesRepository extends Repository<InviteCodeEntity> {
  async isCodeAvailable(code: string): Promise<boolean> {
    try {
      const entity = await this.findOne(code);
      return !(!entity || entity.account);
    } catch (e) {
      return false;
    }
  }
}