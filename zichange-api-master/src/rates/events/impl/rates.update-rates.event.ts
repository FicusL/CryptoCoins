import { IEvent } from '@nestjs/cqrs';
import { IRates } from '../../../realtime/abstract/realtime.rates.interface';

export class RatesUpdateRatesEvent implements IEvent {
  constructor(
    public readonly rates: IRates,
  ) { }
}