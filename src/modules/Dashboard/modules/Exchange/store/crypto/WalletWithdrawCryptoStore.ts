import { inject, injectable } from 'inversify';
import { WalletStore } from '../WalletStore';
import { LoaderStore } from '../../../../../Shared/modules/Loader/store/LoaderStore';
import { AxiosWrapper } from '../../../../../Shared/services/AxiosWrapper';
import { TransactionsStore } from '../../../Transactions/stores/TransactionsStore';
import { action, computed, observable, runInAction } from 'mobx';
import { TransactionType } from '../../../../../Shared/modules/Transactions/const/TransactionType';
import { BigNumber } from 'bignumber.js';
import { AxiosResponse } from 'axios';
import { AccountStore } from '../../../Profile/stores/AccountStore';
import { IOutTransactionDTO } from '../../../../../Shared/modules/Transactions/abstract/dto/IOutTransactionDTO';
import { IInTransactionCreateDTO } from '../../../../../Shared/modules/Transactions/abstract/dto/IInTransactionCreateDTO';
import { TransactionWithdrawalMethodType } from '../../../../../Shared/modules/Transactions/const/TransactionWithdrawalMethodType';
import { Fees } from '../../../../../Shared/services/Fees/Fees';
import { TransactionExceptionsCodes } from '../../../Transactions/const/TransactionExceptionCodes';
import { ModalStore } from '../../../../../Modals/store/ModalStore';

@injectable()
export class WalletWithdrawCryptoStore {
  private static readonly FRACTION_LENGTH = 8;
  private static readonly SUBMIT_TASK = 'SUBMIT_TASK';

  @inject(WalletStore)
  private readonly walletStore: WalletStore;

  @inject(LoaderStore)
  private readonly loaderStore: LoaderStore;

  @inject(AxiosWrapper)
  private readonly axiosWrapper: AxiosWrapper;

  @inject(TransactionsStore)
  private readonly transactionsStore: TransactionsStore;

  @inject(AccountStore)
  private readonly accountStore: AccountStore;

  @inject(Fees)
  private readonly fees: Fees;

  @inject(ModalStore)
  private readonly modalStore: ModalStore;

  @observable paymentAmountRaw = '';
  @observable paymentAmountError = '';
  @observable receiveMethodId = -1;
  @observable paymentMethodIdError = '';
  @observable receiveMethodType = TransactionWithdrawalMethodType.CryptoWallet;

  @observable twoFACode = '';
  @observable twoFACodeError = '';

  @observable receiveCurrency = 'BTC';
  @observable type = TransactionType.Withdrawal;

  @observable feeAmount = new BigNumber(0);

  @computed
  get feeAmountString() {
    return this.feeAmount.toFixed(WalletWithdrawCryptoStore.FRACTION_LENGTH);
  }

  @computed
  get paymentAmount() {
    return new BigNumber(this.paymentAmountRaw || '0');
  }

  @computed
  get receiveAmountToRaw() {
    return this.paymentAmount.toFixed(WalletWithdrawCryptoStore.FRACTION_LENGTH);
  }

  @computed
  get receiveAmount() {
    return this.paymentAmount.minus(this.feeAmount).toFixed(WalletWithdrawCryptoStore.FRACTION_LENGTH);
  }

  @computed
  get receiveInputError() {
    return this.paymentAmountError;
  }

  @computed
  get receiveMethodError() {
    return this.paymentMethodIdError;
  }

  @computed
  get twoFaCode() {
    return this.twoFACode;
  }

  @action
  reset() {
    this.feeAmount = new BigNumber(0);
    this.paymentAmountRaw = '';
    this.twoFACode = '';
    this.twoFACodeError = '';
    this.paymentAmountError = '';
    this.paymentMethodIdError = '';
  }

  @action
  twoFACodeChange(value) {
    this.twoFACode = value;
  }

  @action
  receiveMethodChange(type: TransactionWithdrawalMethodType, id: number) {
    this.receiveMethodType = type;
    this.receiveMethodId = id;
    this.paymentMethodIdError = this.receiveMethodId >= 0 ? '' : 'dashboard.fieldIsRequired';
  }

  @action
  async calcFee() {
    const feeStr = await this.fees.getWithdrawFee(this.receiveCurrency,
      this.receiveAmountToRaw, this.receiveMethodType);

    runInAction(() => {
      this.feeAmount = new BigNumber(feeStr);
    });
  }

  @action
  receiveAmountChange(amount: string) {
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
      if (fraction && fraction.length > WalletWithdrawCryptoStore.FRACTION_LENGTH) {
        return;
      }
    }

    if (!isValidAmount) {
      return;
    }

    this.paymentAmountRaw = satinizedAmount;
  }

  @action
  validate() {
    const cryptoBalance = this.walletStore.cryptoBalances.get(this.receiveCurrency) as BigNumber;

    if (!this.paymentAmountRaw) {
      this.paymentAmountError = 'dashboard.fieldIsRequired';
    } else if (cryptoBalance.isEqualTo(0)) {
      this.paymentAmountError = 'dashboard.topUpBalance';
    } else if (cryptoBalance.isLessThan(this.paymentAmount)) {
      this.paymentAmountError = 'dashboard.balanceIsInsufficient';
    } else {
      this.paymentAmountError = '';
    }

    if (this.accountStore.twoFaEnabled) {
      this.twoFACodeError = this.twoFACode ? '' : 'dashboard.fieldIsRequired';
    }

    this.paymentMethodIdError = this.receiveMethodId >= 0 ? '' : 'dashboard.fieldIsRequired';
    return !this.paymentAmountError && !this.paymentMethodIdError && !this.twoFACodeError;
  }

  @action
  submit(): Promise<string | undefined> {
    const payload = {
      type: TransactionType.Withdrawal,

      withdrawal: {
        isActive: true,
        amount: this.paymentAmountRaw,
        currency: this.receiveCurrency,
        type: this.receiveMethodType,
        methodId: this.receiveMethodId,
      },

      code2FA: this.twoFACode,
    } as IInTransactionCreateDTO;

    this.loaderStore.addTask(WalletWithdrawCryptoStore.SUBMIT_TASK);

    return this.axiosWrapper.post('/transactions', payload)
      .then(this.onCreateTransactionSuccess)
      .catch(this.onCreateTransactionError);
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
        this.modalStore.closeModal('WITHDRAW_CRYPTO');
        this.modalStore.openModal('WITHDRAW_LIMIT_EXCEEDED', {
          tierLevel: constraintData.tierLevel,
          tierLevelNext: constraintData.tierLevelNext,
          tierLevelLimit: constraintData.limit,
          remainingLimit: constraintData.remaining,
        });
      } else  if (constraintProperty === 'code') {
        this.twoFACodeError = firstConstraint.description;
      } else if (constraintProperty === 'receiveMethodType' || 'receiveMethodId') {
        this.paymentMethodIdError = firstConstraint.description;
      } else {
        this.paymentAmountError = firstConstraint.description;
      }
    }

    this.loaderStore.removeTask(WalletWithdrawCryptoStore.SUBMIT_TASK);
    return undefined;
  }

  @action.bound
  protected onCreateTransactionSuccess(result: IOutTransactionDTO) {
    this.loaderStore.removeTask(WalletWithdrawCryptoStore.SUBMIT_TASK);
    return result.referenceId;
  }

}