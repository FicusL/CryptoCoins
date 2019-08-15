import { RealtimeBaseStore } from '../../../stores/RealtimeBaseStore';
import { action, observable } from 'mobx';
import { BigNumber } from 'bignumber.js';
import { RealtimeExchangeRateMessages } from '../const/RealtimeExchangeRateMessages';
import { injectable } from 'inversify';

const requiredExchanges = [
  'BTC-EUR', 'EUR-BTC',
  'ETH-EUR', 'EUR-ETH',
  'ZCN-EUR', 'EUR-ZCN',
];

interface IExchangeSocketPayload {
  bid : { [pair: string]: string };
  ask : { [pair: string]: string };
  change : { [pair: string]: string };
}

const defaultValue = Object.assign({}, ...requiredExchanges.map((direction) => (
  { [direction]: new BigNumber(NaN) }
)));

@injectable()
export class ExchangeRatesStore extends RealtimeBaseStore {
  @observable bid = defaultValue;
  @observable ask = defaultValue;
  @observable change = defaultValue;

  constructor() {
    super();
    this.subscribe();
  }

  @action
  subscribe() {
    this.socket.emit(RealtimeExchangeRateMessages.Update);
    this.socket.on(RealtimeExchangeRateMessages.Update, this.onUpdate);
  }

  @action.bound
  onUpdate(data: IExchangeSocketPayload) {
    const { bid, ask, change } = data;

    for (const key of requiredExchanges) {
      this.bid[key] = new BigNumber(bid[key] || NaN);
      this.ask[key] = new BigNumber(ask[key] || NaN);
      this.change[key] = new BigNumber(change[key] || NaN);
    }
  }
}