import { IRealtimeRateItem } from './realtime.rates-item.interface';

export interface IRates {
  bid: IRealtimeRateItem;
  ask: IRealtimeRateItem;
  change: IRealtimeRateItem;
  median: IRealtimeRateItem;
}