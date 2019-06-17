import { RealtimeAddKycEventHandler } from './realtime.add-kyc.event-handler';
import { RealtimeUpdateKycStatusEventHandler } from './realtime.update-kyc-status.event-handler';
import { RealtimeUpdateSettingsEventHandler } from './realtime.update-settings.event-handler';
import { RealtimeUpdateRatesEventHandler } from './realtime.update-rates.event-handler';
import { RealtimeCreateAccountEventHandler } from './realtime.create-account.event-handler';
import { RealtimeAddTransactionEventHandler } from './realtime.add-transaction.event-handler';

export const RealtimeEventHandlers = [
  RealtimeAddKycEventHandler,
  RealtimeUpdateKycStatusEventHandler,
  RealtimeUpdateSettingsEventHandler,
  RealtimeUpdateRatesEventHandler,
  RealtimeCreateAccountEventHandler,
  RealtimeAddTransactionEventHandler,
];