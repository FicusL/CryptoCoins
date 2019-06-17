import {Provider} from '@nestjs/common';
import {RealtimeGetKycInfoAdminMessageHandler} from '../message-handler/admin/realtime.get-kyc-info.admin-message-handler';

export const notificationAdminMessageHandlers: Provider[] = [
  {
    provide: RealtimeGetKycInfoAdminMessageHandler,
    useClass: RealtimeGetKycInfoAdminMessageHandler,
  },
];