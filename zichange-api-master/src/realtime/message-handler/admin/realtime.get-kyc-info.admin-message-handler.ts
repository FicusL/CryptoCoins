import { BaseGatewayMessageHandler } from '../../../core/gateway/handler/base.gateway.message.handler';
import { RealtimeAdminGatewayClient } from '../../model/realtime.admin.gateway.client';
import { InAdminGetKycDto } from '../../dto/admin/in.admin.get-kyc.dto';
import { RealtimeTransactionAdminMessages } from '../../const/realtime.admin.messages.enum';
import { KycService } from '../../../kyc/service/kyc.service';
import { Injectable } from '@nestjs/common';
import { AccountService } from '../../../account/service/account.service';

@Injectable()
export class RealtimeGetKycInfoAdminMessageHandler extends
  BaseGatewayMessageHandler<RealtimeAdminGatewayClient, Promise<void>>
{
  constructor(
    private readonly kycService: KycService,
    private readonly accountService: AccountService,
  ) {
    super();
  }

  async handle(client: RealtimeAdminGatewayClient, payload: InAdminGetKycDto): Promise<void>  {
    try {
      const account = await this.accountService.getAccountById(payload.accountId);
      const dto = await this.kycService.getKycDto(account);
      client.socket.emit(RealtimeTransactionAdminMessages.GetKycInfo, dto);
    } catch (e) {
      return;
    }
  }
}