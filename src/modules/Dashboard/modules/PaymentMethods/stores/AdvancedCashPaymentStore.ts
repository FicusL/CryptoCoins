import { inject, injectable } from 'inversify';
import { action, observable } from 'mobx';
import { IPaymentStore } from './abstract/IPaymentStore';
import { AxiosWrapper } from '../../../../Shared/services/AxiosWrapper';
import { LoaderStore } from '../../../../Shared/modules/Loader/store/LoaderStore';
import { ModalStore } from '../../../../Modals/store/ModalStore';
import { TransactionModel } from '../../../../Shared/modules/Transactions/model/TransactionModel';
import { IOutPaymentPayeerFormDTO } from './dto/IOutPaymentPayeerFormDTO';

@injectable()
export class AdvancedCashPaymentStore implements IPaymentStore {
  private static readonly PAY_REQUEST_ADVANCED_CASH_TASK = 'PAY_REQUEST_ADVANCED_CASH_TASK';

  @observable form;

  @observable ac_account_email: string = '';
  @observable ac_sci_name: string = '';
  @observable ac_amount: string = '';
  @observable ac_currency: string = '';
  @observable ac_order_id: string = '';
  @observable ac_sign: string = '';
  @observable ac_ps : string = '';
  @observable ac_comments : string = '';

  @inject(AxiosWrapper)
  private readonly api: AxiosWrapper;

  @inject(LoaderStore)
  private readonly loaderStore: LoaderStore;

  @inject(ModalStore)
  private readonly modalStore: ModalStore;

  @action
  payRequest(transaction: TransactionModel) {
    this.loaderStore.addTask(AdvancedCashPaymentStore.PAY_REQUEST_ADVANCED_CASH_TASK);
    return this.api.get(`/transactions/payment/advanced_cash/form/${transaction.referenceId}`)
      .then(this.onPayRequestSuccess)
      .catch(this.onPayRequestError);
  }

  @action.bound
  protected onPayRequestSuccess(data: IOutPaymentPayeerFormDTO) {
    this.loaderStore.removeTask(AdvancedCashPaymentStore.PAY_REQUEST_ADVANCED_CASH_TASK);
    Object.assign(this, { ...data, form: this.form });
    setTimeout(this.onFormReadyToSubmit, 500);
  }

  @action.bound
  protected onFormReadyToSubmit() {
    this.loaderStore.removeTask(AdvancedCashPaymentStore.PAY_REQUEST_ADVANCED_CASH_TASK);
    this.form.submit();
  }

  @action.bound
  protected onPayRequestError(reason) {
    this.loaderStore.removeTask(AdvancedCashPaymentStore.PAY_REQUEST_ADVANCED_CASH_TASK);
    this.modalStore.openModal(
      'ERROR',
      {description: 'Transaction with this reference ID can\'t be paid'},
    );
  }

  @action
  attachForm(form) {
    this.form = form;
  }
}