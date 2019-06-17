import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RealtimeClientGateway } from '../../gateway/realtime.client.gateway';
import { RatesUpdateRatesEvent } from '../../../rates/events/impl/rates.update-rates.event';

@EventsHandler(RatesUpdateRatesEvent)
export class RealtimeUpdateRatesEventHandler implements IEventHandler<RatesUpdateRatesEvent> {
  constructor(
    private readonly realtimeClientGateway: RealtimeClientGateway,
  ) { }

  async handle(event: RatesUpdateRatesEvent) {
    await this.realtimeClientGateway.onUpdateRates(event.rates);
  }
}