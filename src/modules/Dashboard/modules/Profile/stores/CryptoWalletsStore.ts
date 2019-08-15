import { action, observable } from 'mobx';
import { ICryptoWallet } from '../interfaces/ICryptoWallet';
import { inject, injectable } from 'inversify';
import { AxiosWrapper } from '../../../../Shared/services/AxiosWrapper';
import { SessionStore } from '../../../../Shared/stores/SessionStore';
import { LoaderStore } from '../../../../Shared/modules/Loader/store/LoaderStore';
import { BaseFormStoreValidatorJS } from '../../../../Shared/stores/Forms/BaseFormStoreValidatorJS';
import { ICryptoWalletFields } from '../interfaces/ICryptoWalletFields';
import { RequiredStringDefault } from '../../../../Shared/const/ValidatorFieldsDefaults';
import { ExternalErrorConverter } from '../../../../Shared/utils/ExternalErrorConverter';
import { ExchangeStore } from '../../Exchange/store/ExchangeStore';
import { ModalStore } from '../../../../Modals/store/ModalStore';

interface IUpdateWalletPayload {
  label: string;
  address: string;
}

interface IAddWalletPayload extends IUpdateWalletPayload {
  accountId: number;
}

class BTCWalletUIStore extends BaseFormStoreValidatorJS<ICryptoWalletFields> {
  protected getInitialFields(): ICryptoWalletFields {
    return {
      label: RequiredStringDefault,
      address: RequiredStringDefault,
    };
  }

  constructor() {
    super();
  }
}

@injectable()
export class CryptoWalletsStore {
  protected static readonly SEND_ADD_CRYPTO_WALLET_TASK = 'SEND_ADD_CRYPTO_WALLET_TASK';
  protected static readonly SEND_UPDATE_CRYPTO_WALLET_TASK = 'SEND_UPDATE_CRYPTO_WALLET_TASK';
  protected static readonly SEND_DELETE_CRYPTO_WALLET_TASK = 'SEND_DELETE_CRYPTO_WALLET_TASK';

  @inject(AxiosWrapper)
  private readonly axiosWrapper: AxiosWrapper;

  @inject(ModalStore)
  private readonly modalStore: ModalStore;

  @inject(SessionStore)
  private readonly sessionStore: SessionStore;

  @inject(LoaderStore)
  private readonly loaderStore: LoaderStore;

  @inject(ExchangeStore)
  private readonly exchangeStore: ExchangeStore;

  readonly UI = new BTCWalletUIStore();

  private readonly addWalletErrorConverter = new ExternalErrorConverter<ICryptoWalletFields>('label');
  private readonly updateWalletErrorConverter = new ExternalErrorConverter<ICryptoWalletFields>('label');

  @observable wallets = new Map<number, ICryptoWallet>();

  @action
  async fetchWallets() {
    const accountId = this.sessionStore.accountId;

    return new Promise(resolve => {
      this.axiosWrapper.get(`/account/${accountId}/crypto_wallets`).then(
        action<any>(wallets => {
          wallets.map(w => this.wallets.set(w.id, w));
          resolve();
        }),
      );
    });
  }

  @action
  async addWallet(wallet: ICryptoWallet): Promise<boolean> {
    const payload: IAddWalletPayload = {
      label: wallet.label,
      address: wallet.address,
      accountId: this.sessionStore.accountId,
    };

    const cryptoWallets = Array.from(this.wallets.values());

    for (let i = 0; i < cryptoWallets.length; ++i) {
      if (payload.address === cryptoWallets[i].address) {
        this.modalStore.closeModal('ADD_WALLET');
        this.modalStore.openModal('CRYPTO_WALLET_ALREADY_HAVE');
        return;
      }
    }

    return new Promise<boolean>(resolve => {
      this.loaderStore.addTask(CryptoWalletsStore.SEND_ADD_CRYPTO_WALLET_TASK);

      this.axiosWrapper.post(`/crypto_wallet`, payload).then(
        action<any>(wallet => {
          this.wallets.set(wallet.id, wallet);
          this.loaderStore.removeTask(CryptoWalletsStore.SEND_ADD_CRYPTO_WALLET_TASK);
          resolve(true);
        }),

        action<any>(reason => {
          this.UI.applyErrors(this.addWalletErrorConverter.convert(this.UI.fields, reason));
          this.loaderStore.removeTask(CryptoWalletsStore.SEND_ADD_CRYPTO_WALLET_TASK);
          resolve(false);
        }),
      );
    });
  }

  @action
  async updateWallet(wallet: ICryptoWallet): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.loaderStore.addTask(CryptoWalletsStore.SEND_UPDATE_CRYPTO_WALLET_TASK);

      this.axiosWrapper.put(`/crypto_wallet/${wallet.id}`, wallet).then(
        action<any>(wallet => {
          this.wallets.set(wallet.id, wallet);
          this.loaderStore.removeTask(CryptoWalletsStore.SEND_UPDATE_CRYPTO_WALLET_TASK);
          resolve(true);
        }),

        action<any>(reason => {
          this.UI.applyErrors(this.updateWalletErrorConverter.convert(this.UI.fields, reason));
          this.loaderStore.removeTask(CryptoWalletsStore.SEND_UPDATE_CRYPTO_WALLET_TASK);
          resolve(false);
        }),
      );
    });
  }

  @action
  deleteWallet(wallet: ICryptoWallet): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.loaderStore.addTask(CryptoWalletsStore.SEND_DELETE_CRYPTO_WALLET_TASK);

      this.axiosWrapper.delete(`/crypto_wallet/${wallet.id}`).then(
        action<any>(result => {
          this.wallets.delete(wallet.id as number);
          this.loaderStore.removeTask(CryptoWalletsStore.SEND_DELETE_CRYPTO_WALLET_TASK);
          resolve(true);
        }),

        action<any>(reason => {
          this.loaderStore.removeTask(CryptoWalletsStore.SEND_DELETE_CRYPTO_WALLET_TASK);
          resolve(false);
        }),
      );
    });
  }
}
