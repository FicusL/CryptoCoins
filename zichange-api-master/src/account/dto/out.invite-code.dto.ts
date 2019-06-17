import { ApiModelProperty } from '@nestjs/swagger';
import { InviteCodeEntity } from '../entitiy/invite-code.entity';
import { ConfigsService } from '../../core/service/configs.service';

export class OutInviteCodeDTO {
  @ApiModelProperty()
  code: string;

  @ApiModelProperty()
  url: string;

  @ApiModelProperty()
  email?: string;

  constructor(entity: InviteCodeEntity) {
    this.code = entity.code;
    this.url = `//${ConfigsService.domainFrontEnd}/register/${this.code}`;

    if (entity.account) {
      this.email = entity.account.email;
    }
  }
}