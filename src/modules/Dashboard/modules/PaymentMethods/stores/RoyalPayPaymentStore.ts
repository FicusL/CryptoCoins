import { action, observable } from 'mobx';
import { inject, injectable } from 'inversify';
import { AxiosWrapper } from '../../../../Shared/services/AxiosWrapper';
import { LoaderStore } from '../../../../Shared/modules/Loader/store/LoaderStore';
import { ModalStore } from '../../../../Modals/store/ModalStore';
import { CounterpartyAccountStore } from '../../../../Counterparty/stores/CounterpartyAccountStore';

@injectable()
export class RoyalPayPaymentStore {
  private static readonly PAY_REQUEST_ROYAL_PAY_TASK = 'PAY_REQUEST_ROYAL_PAY_TASK';

  @observable form;

  @inject(AxiosWrapper)
  private readonly api: AxiosWrapper;

  @inject(LoaderStore)
  private readonly loaderStore: LoaderStore;

  @inject(ModalStore)
  private readonly modalStore: ModalStore;

  @inject(CounterpartyAccountStore)
  private readonly counterpartyAccountStore: CounterpartyAccountStore;

  @observable cardNumberError: string = '';
  @observable cvcError: string = '';
  @observable nameError: string = '';
  @observable expirationYearError: string = '';
  @observable expirationMonthError: string = '';
  @observable confirm1Error: string = '';
  @observable confirm2Error: string = '';

  @observable url: string = '';
  @observable method: string = '';
  @observable params;

  @action
  reset() {
    this.cardNumberError = '';
    this.cvcError = '';
    this.nameError = '';
    this.expirationMonthError = '';
    this.expirationYearError = '';
    this.confirm1Error = '';
    this.confirm2Error = '';

    this.url = '';
    this.method = '';
    this.params = null;
  }

  @action
  payRequest(payload) {
    this.loaderStore.addTask(RoyalPayPaymentStore.PAY_REQUEST_ROYAL_PAY_TASK);
    const uri = this.counterpartyAccountStore.isAgent ?
      `/transactions/payment/royalpay/token/${this.counterpartyAccountStore.token}` :
      `/transactions/payment/royalpay/reference/${this.counterpartyAccountStore.referenceId}`;

    return this.api.post(uri, payload)
      .then(this.onPayRequestSuccess)
      .catch(this.onPayRequestError);
  }

  @action.bound
  protected onPayRequestSuccess(result) {
    this.loaderStore.removeTask(RoyalPayPaymentStore.PAY_REQUEST_ROYAL_PAY_TASK);
    this.method = result.method;

    if (this.method.toUpperCase() === 'GET') {
      const data = Object.getOwnPropertyNames(result.params);

      let str: string = '?';

      for (const item of data) {
        str += `${item}=${result.params[item]}&`;
      }

      str = str.slice(0, str.length - 1);

      this.url = `${result.url}${str}`;
    } else {
      this.url = result.url;
      this.params = Object.entries(result.params).filter(item => !!item[1]);
      // Object.assign(this, { ...result, form: this.form });
      // setTimeout(this.onFormReadyToSubmit, 500);
    }
  }

  @action.bound
  protected onPayRequestError(reason) {
    this.loaderStore.removeTask(RoyalPayPaymentStore.PAY_REQUEST_ROYAL_PAY_TASK);
    this.reset();
    for (const error of reason.data.message) {

      const errorMessage = error.constraints[Object.keys(error.constraints)[0]];

      if (error.property === 'cardNumber') {
        this.cardNumberError = errorMessage;
      }
      if (error.property === 'cvc') {
        this.cvcError = errorMessage;
      }
      if (error.property === 'name') {
        this.nameError = errorMessage;
      }
      if (error.property === 'expirationYear') {
        this.expirationYearError = errorMessage || error.value;
      }
      if (error.property === 'expirationMonth') {
        this.expirationMonthError = errorMessage;
      }
      if (error.property === 'confirm1') {
        this.confirm1Error = errorMessage;
      }
      if (error.property === 'confirm2') {
        this.confirm2Error = errorMessage;
      }
    }
  }

  @action.bound
  protected onFormReadyToSubmit() {
    this.loaderStore.removeTask(RoyalPayPaymentStore.PAY_REQUEST_ROYAL_PAY_TASK);
    this.form.submit();
  }

  @action
  attachForm(form) {
    this.form = form;
  }
}