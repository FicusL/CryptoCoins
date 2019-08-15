import { BaseMinAmountsStore } from './BaseMinAmountsStore';
import { injectable } from 'inversify';

@injectable()
export class WithdrawalMinAmountsStore extends BaseMinAmountsStore {
  protected static readonly REQUEST_WITHDRAWAL_MIN_AMOUNTS_TASK = 'REQUEST_WITHDRAWAL_MIN_AMOUNTS_TASK';

  protected get requestTask(): string {
    return WithdrawalMinAmountsStore.REQUEST_WITHDRAWAL_MIN_AMOUNTS_TASK;
  }

  protected get requestURL(): string {
    return '/settings/min_amounts/withdrawal';
  }

}