import { Provider } from '@nestjs/common';
import { RealtimeTransactionRequestClientMessageHandler } from '../message-handler/client/realtime.transaction-request.client-message-handler';

export const notificationClientMessageHandlers: Provider[] = [
  {
    provide: RealtimeTransactionRequestClientMessageHandler,
    useClass: RealtimeTransactionRequestClientMessageHandler,
  },
];