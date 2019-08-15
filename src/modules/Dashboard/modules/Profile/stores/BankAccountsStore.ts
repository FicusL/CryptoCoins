import { IBankAccount } from '../interfaces/IBankAccount';
import { action, observable } from 'mobx';
import { inject, injectable } from 'inversify';
import { AxiosWrapper } from '../../../../Shared/services/AxiosWrapper';
import { BaseFormStoreValidatorJS } from '../../../../Shared/stores/Forms/BaseFormStoreValidatorJS';
import { IBankAccountFields } from '../interfaces/IBankAccountFields';
import { RequiredStringDefault } from '../../../../Shared/const/ValidatorFieldsDefaults';
import { LoaderStore } from '../../../../Shared/modules/Loader/store/LoaderStore';
import { SessionStore } from '../../../../Shared/stores/SessionStore';
import { ExternalErrorConverter } from '../../../../Shared/utils/ExternalErrorConverter';
import { ExchangeStore } from '../../Exchange/store/ExchangeStore';
import { ModalStore } from '../../../../Modals/store/ModalStore';

interface IUpdateBankAccountPayload {
  label: string;
  bankName: string;
  recipientName: string;
  currency: string;
  IBAN: string;
  BIC: string;
}

interface IAddBankAccountPayload extends IUpdateBankAccountPayload {
  accountId: number;
}

class BankAccountUIStore extends BaseFormStoreValidatorJS<IBankAccountFields> {
  protected getInitialFields(): IBankAccountFields {
    return {
      label: {
        value: '',
        error: '',
        rule: 'string',
      },

      bankName: RequiredStringDefault,
      recipientName: RequiredStringDefault,
      currency: RequiredStringDefault,
      IBAN: RequiredStringDefault,
      BIC: RequiredStringDefault,
    };
  }

  constructor() {
    super();
  }
}

@injectable()
export class BankAccountsStore {
  protected static readonly SEND_ADD_BANK_ACCOUNT_TASK = 'SEND_ADD_BANK_ACCOUNT_TASK';
  protected static readonly SEND_UPDATE_BANK_ACCOUNT_TASK = 'SEND_UPDATE_BANK_ACCOUNT_TASK';
  protected static readonly SEND_DELETE_BANK_ACCOUNT_TASK = 'SEND_DELETE_BANK_ACCOUNT_TASK';

  @inject(AxiosWrapper)
  private readonly axiosWrapper: AxiosWrapper;

  @inject(SessionStore)
  private readonly sessionStore: SessionStore;

  @inject(LoaderStore)
  private readonly loaderStore: LoaderStore;

  @inject(ExchangeStore)
  private readonly exchangeStore: ExchangeStore;

  @inject(ModalStore)
  private readonly modalStore: ModalStore;

  readonly UI = new BankAccountUIStore();

  private readonly addBankAccountErrorConverter = new ExternalErrorConverter<IBankAccountFields>('label');
  private readonly updateBankAccountErrorConverter = new ExternalErrorConverter<IBankAccountFields>('label');

  @observable bankAccounts = new Map<number, IBankAccount>();
  @observable availableCurrencies: string[] = [];

  @action
  async fetchBankAccounts() {
    const accountId = this.sessionStore.accountId;

    return new Promise(resolve => {
      this.axiosWrapper.get(`/account/${accountId}/bank_accounts`).then(
        action<any>(bankAccounts => {
          bankAccounts.map(b => this.bankAccounts.set(b.id, b));
          resolve();
        }),
      );
    });
  }

  @action
  fetchAvailableCurrencies() {
    this.axiosWrapper.get('/settings/available_currencies/bank_accounts').then(
      action<any>((result: { currencies: string[] }) => {
        this.availableCurrencies.length = 0;
        this.availableCurrencies.push( ...result.currencies );
      }),
    );
  }

  @action
  async addBankAccount(bankAccount: IBankAccount) {
    const payload: IAddBankAccountPayload = {
      label: bankAccount.label,
      bankName: bankAccount.bankName,
      recipientName: bankAccount.recipientName,
      currency: bankAccount.currency,
      IBAN: bankAccount.IBAN.replace(/ /g,''),
      BIC: bankAccount.BIC,
      accountId: this.sessionStore.accountId,
    };

    const bankAccounts = Array.from(this.bankAccounts.values());

    for (let i = 0; i < bankAccounts.length; ++i) {
      if (payload.IBAN === bankAccounts[i].IBAN) {
        this.modalStore.closeModal('ADD_BANK');
        this.modalStore.openModal('BANK_ACCOUNT_ALREADY_HAVE');
        return;
      }
    }

    return new Promise<boolean>(resolve => {
      this.loaderStore.addTask(BankAccountsStore.SEND_ADD_BANK_ACCOUNT_TASK);

      this.axiosWrapper.post(`/bank_account`, payload).then(
        action<any>(bankAccount => {
          this.bankAccounts.set(bankAccount.id, bankAccount);
          this.loaderStore.removeTask(BankAccountsStore.SEND_ADD_BANK_ACCOUNT_TASK);
          resolve(true);
          return;
        }),

        action<any>(reason => {
          this.UI.applyErrors(this.addBankAccountErrorConverter.convert(this.UI.fields, reason));
          this.loaderStore.removeTask(BankAccountsStore.SEND_ADD_BANK_ACCOUNT_TASK);
          resolve(false);
          return;
        }),
      );
    });
  }

  @action
  async updateBankAccount(bankAccount: IBankAccount) {
    return new Promise<boolean>(resolve => {
      this.loaderStore.addTask(BankAccountsStore.SEND_UPDATE_BANK_ACCOUNT_TASK);

      this.axiosWrapper.put(`/bank_account/${bankAccount.id}`, bankAccount).then(
        action<any>(bankAccount => {
          this.bankAccounts.set(bankAccount.id, bankAccount);
          this.loaderStore.removeTask(BankAccountsStore.SEND_UPDATE_BANK_ACCOUNT_TASK);
          resolve(true);
        }),

        action<any>(reason => {
          this.UI.applyErrors(this.updateBankAccountErrorConverter.convert(this.UI.fields, reason));
          this.loaderStore.removeTask(BankAccountsStore.SEND_UPDATE_BANK_ACCOUNT_TASK);
          resolve(false);
        }),
      );
    });
  }

  @action
  async deleteBankAccount(bankAccount: IBankAccount): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.loaderStore.addTask(BankAccountsStore.SEND_DELETE_BANK_ACCOUNT_TASK);

      this.axiosWrapper.delete(`/bank_account/${bankAccount.id}`).then(
        action<any>(result => {
          this.bankAccounts.delete(bankAccount.id as number);
          this.loaderStore.removeTask(BankAccountsStore.SEND_DELETE_BANK_ACCOUNT_TASK);
          resolve(true);
        }),

        action<any>(reason => {
          this.loaderStore.removeTask(BankAccountsStore.SEND_DELETE_BANK_ACCOUNT_TASK);
          resolve(false);
        }),
      );
    });
  }
}