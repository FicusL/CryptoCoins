import { InviteCodesRepository } from '../repository/invite-codes.repository';
import { InviteCodeEntity } from '../entitiy/invite-code.entity';
import { OutInviteCodeDTO } from '../dto/out.invite-code.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigsService } from '../../core/service/configs.service';

export class InviteCodesService {
  constructor(
    @InjectRepository(InviteCodesRepository)
    private readonly repository: InviteCodesRepository,
  ) { }

  static readonly IS_ENABLED = ConfigsService.registerByInviteCodes;

  async getAllCodes(): Promise<OutInviteCodeDTO[]> {
    const entities = await this.repository.find();
    return entities.map((e) => new OutInviteCodeDTO(e));
  }

  async generateCode(): Promise<OutInviteCodeDTO> {
    let entity = new InviteCodeEntity();
    entity = await this.repository.save(entity);
    return new OutInviteCodeDTO(entity);
  }
}