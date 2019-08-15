import * as React from 'react';
import { lazyInject } from '../../../../IoC';
import { AccountStore } from '../stores/AccountStore';
import { observer } from 'mobx-react';
import { ModalStore } from '../../../../Modals/store/ModalStore';
import Tabs from '../../../../Shared/components/Tabs/Tabs';
import BankAccounts from '../components/BankAccounts';
import BtcWallets from '../components/CryptoWallets';
import { CryptoWalletsStore } from '../stores/CryptoWalletsStore';
import { BankAccountsStore } from '../stores/BankAccountsStore';
import { injectIntl, InjectedIntlProps } from 'react-intl';

@observer
class AccountDetailsContainer extends React.Component<InjectedIntlProps> {
  @lazyInject(ModalStore)
  private readonly modalStore: ModalStore;

  @lazyInject(AccountStore)
  private readonly accountStore: AccountStore;

  @lazyInject(CryptoWalletsStore)
  private readonly cryptoWalletStore: CryptoWalletsStore;

  @lazyInject(BankAccountsStore)
  private readonly bankAccountsStore: BankAccountsStore;

  render() {
    const { bankAccounts, btcWallets } = this.accountStore;
    const { intl } = this.props;

    return ( 
      <div className='account__details'>
        <Tabs tabs={[
          [
            intl.formatMessage({
              id: 'dashboard.settings.bankAccounts',
              defaultMessage: 'Bank accounts',
            }),
            () => <BankAccounts
              bankAccounts={bankAccounts}
              onBankClick={(bankAccount) => this.modalStore.openModal('CHANGE_BANK', { bankAccount }) }
              onAddBankClick={() => this.modalStore.openModal('ADD_BANK')}
              onCrossClick={(bankAccount) => this.modalStore.openModal('DELETE_CONFIRM', {bankAccount})}
            />,
          ],
          [
            intl.formatMessage({
              id: 'dashboard.settings.cryptoWallets',
              defaultMessage: 'Crypto wallets',
            }),
            () => <BtcWallets
              wallets={btcWallets}
              onWalletClick={(wallet) => this.modalStore.openModal('CHANGE_WALLET', { wallet })}
              onAddWalletClick={() => this.modalStore.openModal('ADD_WALLET')}
              onCrossClick={(wallet) => this.modalStore.openModal('DELETE_CONFIRM', {wallet})}
            />,
          ],
        ]}/>
      </div>
    );
  }
}

export default injectIntl(AccountDetailsContainer);