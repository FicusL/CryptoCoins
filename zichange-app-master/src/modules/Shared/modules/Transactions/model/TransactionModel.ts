import { TransactionStatus } from '../const/TransactionStatus';
import { IOutTransactionDTO } from '../abstract/dto/IOutTransactionDTO';
import { TransactionType } from '../const/TransactionType';
import { TransactionDepositPartModel } from './parts/TransactionDepositPartModel';
import { TransactionExchangePartModel } from './parts/TransactionExchangePartModel';
import { TransactionCreationPartModel } from './parts/TransactionCreationPartModel';
import { TransactionWithdrawalPartModel } from './parts/TransactionWithdrawalPartModel';
import { action, computed, observable } from 'mobx';
import BigNumber from 'bignumber.js';

// TODO: Move to separate file / integrate with intl
const transactionTypeLabels = {
  [TransactionType.Deposit]: 'Deposit',
  [TransactionType.Exchange]: 'Exchange',
  [TransactionType.Withdrawal]: 'Withdrawal',
  [TransactionType.ExchangeWithdrawal]: 'Exchange + Withdrawal',
  [TransactionType.DepositExchangeWithdrawal]: 'Deposit + Exchange + Withdrawal',
};

export class TransactionModel implements IOutTransactionDTO {
  @observable id: number;
  @observable status: TransactionStatus;
  @observable expectedDate: Date;
  @observable possibleStatuses: TransactionStatus[];
  @observable referenceId: string;
  @observable deposit?: TransactionDepositPartModel;
  @observable exchange?: TransactionExchangePartModel;
  @observable withdrawal?: TransactionWithdrawalPartModel;
  @observable creation?: TransactionCreationPartModel;
  @observable type: TransactionType;
  @observable rejectReason?: string;
  @observable rejectStatus?: TransactionStatus;
  @observable counterpartyWallet?: string;
  @observable email: string;

  @computed
  get date(): Date | undefined {
    if (this.creation && this.creation.date) {
      return this.creation.date;
    }

    return undefined;
  }

  @computed
  get typeString(): string {
    return transactionTypeLabels[this.type];
  }

  @computed
  get currency(): string {
    if (this.exchange) {
      return this.exchange.from.currency;
    }

    if (this.deposit) {
      return this.deposit.currency;
    }

    if (this.withdrawal) {
      return this.withdrawal.currency;
    }

    return 'Unknown';
  }

  @computed
  get exchangeFeeString() {
    if (this.exchange && this.exchange.fee.amount.isGreaterThan(0)) {
      return this.exchange.fee.toString() + ' ' + this.exchange.fee.currency;
    }

    return null;
  }

  @computed
  get depositFeeString() {
    if (this.deposit) {
      const feeString = this.deposit.fee.toString() || '0';
      return feeString + ' ' + this.deposit.fee.currency;
    }

    return null;
  }

  @computed
  get withdrawalFeeString() {
    if (this.withdrawal && this.withdrawal.fee.amount.isGreaterThan(0)) {
      return this.withdrawal.fee.toString() + ' ' + this.withdrawal.fee.currency;
    }

    return null;
  }

  @computed
  get feeString(): string {
    let result = '';

    if (this.deposit) {
      result += this.deposit.fee.toString();
    }

    if (this.exchange) {
      if (this.deposit) {
        result += ' ';
      }

      result += this.exchange.fee.toString();
    }

    if (this.withdrawal) {
      if (this.exchange) {
        result += ' ';
      }

      result += this.withdrawal.fee.toString();
    }

    if (!result) {
      result = '0';
    }

    return result;
  }

  @computed
  get fromAmount(): BigNumber {
    if (this.deposit) {
      return this.deposit.amount;
    }

    if (this.exchange) {
      return this.exchange.from.amount;
    }

    if (this.withdrawal) {
      return this.withdrawal.amount;
    }
  }

  @computed
  get fromCurrency(): string {
    if (this.deposit) {
      return this.deposit.currency;
    }

    if (this.exchange) {
      return this.exchange.from.currency;
    }

    if (this.withdrawal) {
      return this.withdrawal.currency;
    }
  }

  @computed
  get toAmount(): BigNumber {
    if (this.withdrawal) {
      return this.withdrawal.amount.minus(this.withdrawal.fee.amount);
    }

    if (this.exchange) {
      return this.exchange.to.amount;
    }

    if (this.deposit) {
      return this.deposit.amount.minus(this.deposit.fee.amount);
    }
  }

  @computed
  get toCurrency(): string {
    if (this.withdrawal) {
      return this.withdrawal.currency;
    }

    if (this.exchange) {
      return this.exchange.to.currency;
    }

    if (this.deposit) {
      return this.deposit.currency;
    }
  }

  @computed
  get amount(): BigNumber {
    if (this.exchange) {
      return this.exchange.from.amount;
    }

    if (this.deposit) {
      return this.deposit.amount;
    }

    if (this.withdrawal) {
      return this.withdrawal.amount;
    }

    return new BigNumber(0);
  }

  @computed
  get statusString(): string {
    let status = this.status.toString();
    if (this.deposit) {
      status += ` (${ this.deposit.paid ? 'Paid' : 'Unpaid' })`;
    }

    return status;
  }

  static async create(DTO: IOutTransactionDTO): Promise<TransactionModel> {
    const model = new TransactionModel();

    Object.assign(model, DTO);

    model.deposit = DTO.deposit
      ? await TransactionDepositPartModel.create(DTO.deposit)
      : undefined;

    model.exchange = DTO.exchange
      ? await TransactionExchangePartModel.create(DTO.exchange)
      : undefined;

    model.withdrawal = DTO.withdrawal
      ? await TransactionWithdrawalPartModel.create(DTO.withdrawal)
      : undefined;

    model.creation = DTO.creation
      ? await TransactionCreationPartModel.create(DTO.creation)
      : undefined;

    return model;
  }
}