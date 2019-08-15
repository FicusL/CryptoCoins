import { BaseFormStore, IValues } from '../../../../Shared/stores/Forms/BaseFormStore';
import { ClassType } from 'class-transformer/ClassTransformer';
import { Equals } from 'class-validator';
import { injectable } from 'inversify';

class PaymentValues implements IValues {
  @Equals(true)
  confirm1: boolean;

  @Equals(true)
  confirm2: boolean;
}

@injectable()
export class PaymentStore extends BaseFormStore<PaymentValues> {
  get type(): ClassType<PaymentValues> {
    return PaymentValues;
  }
}