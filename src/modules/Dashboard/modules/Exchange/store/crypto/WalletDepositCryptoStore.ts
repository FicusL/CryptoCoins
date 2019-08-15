import { inject, injectable } from 'inversify';
import { AccountStore } from '../../../Profile/stores/AccountStore';
import { action, observable } from 'mobx';
import { TransactionType } from '../../../../../Shared/modules/Transactions/const/TransactionType';
import { WalletStore } from '../WalletStore';

@injectable()
export class WalletDepositCryptoStore {
  @inject(AccountStore)
  accountStore: AccountStore;

  @inject(WalletStore)
  walletStore: WalletStore;

  @observable paymentCurrency = 'BTC';
  @observable type = TransactionType.Deposit;

  @action
  selectedCurrencyWalletAddress(value : string) : string {
    return this.accountStore.cryptoWalletAddress(value);
  }

  @action
  selectedCurrencyWalletAddressQR(value : string) : string {
    return this.accountStore.cryptoWalletAddressQR(value);
  }
}