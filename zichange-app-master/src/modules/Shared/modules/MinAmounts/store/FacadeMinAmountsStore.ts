import { inject, injectable } from 'inversify';
import { DepositMinAmountsStore } from './concrete/DepositMinAmountsStore';
import { ExchangeMinAmountsStore } from './concrete/ExchangeMinAmountsStore';
import { WithdrawalMinAmountsStore } from './concrete/WithdrawalMinAmountsStore';
import { action } from 'mobx';

@injectable()
export class FacadeMinAmountsStore {
  @inject(DepositMinAmountsStore)
  protected readonly depositMinAmountsStore: DepositMinAmountsStore;

  @inject(ExchangeMinAmountsStore)
  protected readonly exchangeMinAmountsStore: ExchangeMinAmountsStore;

  @inject(WithdrawalMinAmountsStore)
  protected readonly withdrawalMinAmountsStore: WithdrawalMinAmountsStore;

  @action
  requestMinAmounts() {
    this.depositMinAmountsStore.requestMinAmounts();
    this.exchangeMinAmountsStore.requestMinAmounts();
    this.withdrawalMinAmountsStore.requestMinAmounts();
  }
}