import { inject, injectable } from 'inversify';
import { action, computed, observable, runInAction } from 'mobx';
import { TransactionDepositMethodType } from '../../../../../Shared/modules/Transactions/const/TransactionDepositMethodType';
import { WalletStore } from '../WalletStore';
import { BigNumber } from 'bignumber.js';
import { TransactionType } from '../../../../../Shared/modules/Transactions/const/TransactionType';
import { LoaderStore } from '../../../../../Shared/modules/Loader/store/LoaderStore';
import { AxiosResponse } from 'axios';
import { AxiosWrapper } from '../../../../../Shared/services/AxiosWrapper';
import { TransactionsStore } from '../../../Transactions/stores/TransactionsStore';
import { IOutTransactionDTO } from '../../../../../Shared/modules/Transactions/abstract/dto/IOutTransactionDTO';
import { IInTransactionCreateDTO } from '../../../../../Shared/modules/Transactions/abstract/dto/IInTransactionCreateDTO';
import { Fees } from '../../../../../Shared/services/Fees/Fees';
import { ModalStore } from '../../../../../Modals/store/ModalStore';
import { TransactionExceptionsCodes } from '../../../Transactions/const/TransactionExceptionCodes';


@injectable()
export class WalletDepositFiatStore {
  private static readonly FRACTION_LENGTH = 2;
  private static readonly SUBMIT_TASK = 'SUBMIT_TASK';

  @inject(WalletStore)
  walletStore: WalletStore;

  @inject(LoaderStore)
  private readonly loaderStore: LoaderStore;

  @inject(AxiosWrapper)
  private readonly axiosWrapper: AxiosWrapper;

  @inject(TransactionsStore)
  private readonly transactionsStore: TransactionsStore;

  @inject(Fees)
  private readonly fees: Fees;

  @inject(ModalStore)
  private readonly modalStore: ModalStore;

  @observable paymentAmountRaw = '';
  @observable receiveAmountRaw = '0';
  @observable paymentAmountError = '';
  @observable paymentMethodId = -1;
  @observable paymentMethodIdError = '';
  @observable paymentMethodType = TransactionDepositMethodType.BankAccount;

  @observable paymentCurrency = 'EUR';
  @observable type = TransactionType.Deposit;

  @observable feeAmount = new BigNumber(0);

  @computed
  get feeAmountString() {
    return this.feeAmount.toFixed(WalletDepositFiatStore.FRACTION_LENGTH);
  }

  @computed
  get paymentAmount() {
    return new BigNumber(this.paymentAmountRaw || '0');
  }

  @computed
  get paymentAmountStringFixed() {
    return this.paymentAmount.toFixed(WalletDepositFiatStore.FRACTION_LENGTH);
  }

  @computed
  get receiveAmount() {
    return new BigNumber(this.receiveAmountRaw || '0');
  }

  @computed
  get paymentInputError() {
    return this.paymentAmountError;
  }

  @computed
  get paymentMethodError() {
    return this.paymentMethodIdError;
  }

  @action
  reset() {
    this.paymentAmountRaw = '';
    this.receiveAmountRaw = '0';
    this.feeAmount = new BigNumber(0);
  }

  @action
  paymentMethodChange(type, id) {
    this.paymentMethodType = type;
    this.paymentMethodId = id;
    this.paymentMethodIdError = this.paymentMethodId >= 0 ? '' : 'dashboard.fieldIsRequired';
    this.calculate();
  }

  @action
  paymentAmountChange(amount: string) {
    let satinizedAmount = amount;

    const isSpliceNeeded = amount.length > 1 && amount[1] !== '.' && amount[0] === '0';
    if (isSpliceNeeded) {
      satinizedAmount = amount.slice(1);
    }

    function isPositiveNumberString(value: string) {
      const number = Number(value);
      return (!isNaN(number));
    }

    const isValidAmount = isPositiveNumberString(satinizedAmount);

    this.paymentAmountError = isValidAmount ? '' : 'dashboard.fieldMustBeANumber';
    if (!this.paymentAmountError) {
      const fraction = satinizedAmount.split('.')[1];
      if (fraction && fraction.length > WalletDepositFiatStore.FRACTION_LENGTH) {
        return;
      }
    }

    if (!isValidAmount) {
      return;
    }

    this.paymentAmountRaw = satinizedAmount;
  }

  @action
  async calculate() {
    const feeStr = await this.fees.getDepositFee(this.paymentCurrency, this.paymentAmountRaw, this.paymentMethodType);

    runInAction(() => {
      this.feeAmount = new BigNumber(feeStr);
      this.receiveAmountRaw =
        this.paymentAmount.minus(this.feeAmount).
        toFixed(WalletDepositFiatStore.FRACTION_LENGTH);
    });
  }

  @action
  validate() {
    this.paymentAmountError = this.paymentAmountRaw ? '' : 'dashboard.fieldIsRequired';
    this.paymentMethodIdError = this.paymentMethodId >= 0 ? '' : 'dashboard.fieldIsRequired';

    return !this.paymentAmountError && !this.paymentMethodIdError;
  }

  @action
  createTransaction(): Promise<string | undefined> {
    const payload = {
      type: this.type,
      deposit: {
        isActive: true,
        amount: this.paymentAmountRaw,
        currency: this.paymentCurrency,
        type: this.paymentMethodType,
      },
    } as IInTransactionCreateDTO;

    this.loaderStore.addTask(WalletDepositFiatStore.SUBMIT_TASK);

    return this.axiosWrapper.post('/transactions', payload)
      .then(this.onCreateTransactionSuccess)
      .catch(this.onCreateTransactionError);
  }

  @action.bound
  protected onCreateTransactionSuccess(result: IOutTransactionDTO) {
    this.loaderStore.removeTask(WalletDepositFiatStore.SUBMIT_TASK);
    return result.referenceId;
  }

  @action.bound
  protected onCreateTransactionError(response: AxiosResponse) {
    if (!response || !response.data || !response.data.message) {
      this.paymentAmountError = 'Unknown error';
    } else {
      const firstConstraint = response.data.message[0];
      const constraintProperty = firstConstraint.property;
      const constraintCode = firstConstraint.code;
      const constraintData = firstConstraint.data || {};

      if (constraintCode === TransactionExceptionsCodes.PaymentLimitExceeded) {
        this.modalStore.closeModal('DEPOSIT_FIAT');
        this.modalStore.openModal('DEPOSIT_LIMIT_EXCEEDED', {
          tierLevel: constraintData.tierLevel,
          tierLevelNext: constraintData.tierLevelNext,
          tierLevelLimit: constraintData.limit,
          remainingLimit: constraintData.remaining,
        });
      } else if (constraintProperty === 'paymentMethodType' || constraintProperty === 'paymentMethodId') {
        this.paymentMethodIdError = firstConstraint.description;
      } else {
        this.paymentAmountError = firstConstraint.description;
      }

      this.paymentAmountError = firstConstraint.description;
    }

    this.loaderStore.removeTask(WalletDepositFiatStore.SUBMIT_TASK);
    return undefined;
  }
}