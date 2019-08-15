import { injectable } from 'inversify';
import { action, observable } from 'mobx';


export enum OperationSteps {
  OrderAccepted,
  GettingFunds,
  PurchaseBTC,
  Sending,
  End,
}

@injectable()
export class OperationProgressStore {

  @observable step: OperationSteps = OperationSteps.OrderAccepted;

  @action.bound
  nextStep() {
    if (this.step < OperationSteps.End) {
      ++this.step;
    }
  }

}