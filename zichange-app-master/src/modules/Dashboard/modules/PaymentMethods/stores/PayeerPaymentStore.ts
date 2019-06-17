import { inject, injectable } from 'inversify';
import { action, observable } from 'mobx';
import { AxiosWrapper } from '../../../../Shared/services/AxiosWrapper';
import { IOutPaymentPayeerFormDTO } from './dto/IOutPaymentPayeerFormDTO';
import { LoaderStore } from '../../../../Shared/modules/Loader/store/LoaderStore';
import { TransactionModel } from '../../../../Shared/modules/Transactions/model/TransactionModel';
import { IPaymentStore } from './abstract/IPaymentStore';
import { ModalStore } from '../../../../Modals/store/ModalStore';

@injectable()
export class PayeerPaymentStore implements IPaymentStore {
  private static readonly PAY_REQUEST_PAYEER_TASK = 'PAY_REQUEST_PAYEER_TASK';

  @observable form;

  @observable m_shop: string = '';
  @observable m_orderid: string = '';
  @observable m_amount: string = '';
  @observable m_curr: string = '';
  @observable m_desc: string = '';
  @observable m_sign: string = '';

  @inject(AxiosWrapper)
  private readonly api: AxiosWrapper;

  @inject(LoaderStore)
  private readonly loaderStore: LoaderStore;

  @inject(ModalStore)
  private readonly modalStore: ModalStore;

  @action
  payRequest(transaction: TransactionModel) {
    this.loaderStore.addTask(PayeerPaymentStore.PAY_REQUEST_PAYEER_TASK);
    return this.api.get(`/transactions/payment/payeer/form/${transaction.referenceId}`)
      .then(this.onPayRequestSuccess)
      .catch(this.onPayRequestError);
  }

  @action.bound
  protected onPayRequestSuccess(data: IOutPaymentPayeerFormDTO) {
    Object.assign(this, { ...data, form: this.form });
    setTimeout(this.onFormReadyToSubmit, 500);
  }

  @action.bound
  protected onFormReadyToSubmit() {
    this.loaderStore.removeTask(PayeerPaymentStore.PAY_REQUEST_PAYEER_TASK);
    this.form.submit();
  }

  @action.bound
  protected onPayRequestError(reason) {
    this.loaderStore.removeTask(PayeerPaymentStore.PAY_REQUEST_PAYEER_TASK);
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