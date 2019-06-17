import { BaseMinAmountsStore } from './BaseMinAmountsStore';
import { injectable } from 'inversify';

@injectable()
export class DepositMinAmountsStore extends BaseMinAmountsStore {
  protected static readonly REQUEST_DEPOSIT_MIN_AMOUNTS_TASK = 'REQUEST_DEPOSIT_MIN_AMOUNTS_TASK';

  protected get requestTask(): string {
    return DepositMinAmountsStore.REQUEST_DEPOSIT_MIN_AMOUNTS_TASK;
  }

  protected get requestURL(): string {
    return '/settings/min_amounts/deposit';
  }

}