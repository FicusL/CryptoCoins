import * as React from 'react';
import { ICryptoWallet } from '../../interfaces/ICryptoWallet';
import ModalBase from '../../../../../Modals/components/ModalBase';
import Button from '../../../../../Shared/components/Buttons/Button';
import { CryptoWalletsStore } from '../../stores/CryptoWalletsStore';
import { lazyInject } from '../../../../../IoC';
import { observer } from 'mobx-react';
import { IBankAccount } from '../../interfaces/IBankAccount';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import { BankAccountsStore } from '../../stores/BankAccountsStore';

interface IProps {
  bankAccount?: IBankAccount;
  wallet?: ICryptoWallet;
  onClose: () => void;
}

@observer
class DeleteConfirmModal extends React.Component<IProps & InjectedIntlProps> {
  @lazyInject(CryptoWalletsStore)
  private readonly cryptoWalletStore: CryptoWalletsStore;

  @lazyInject(BankAccountsStore)
  private readonly bankAccountStore: BankAccountsStore;

  constructor(props) {
    super(props);
  }

  deleteWallet = async () => {
    let result;

    if (this.props.wallet) {
      result = await this.cryptoWalletStore.deleteWallet(this.props.wallet);
    } else {
      result = await this.bankAccountStore.deleteBankAccount(this.props.bankAccount);
    }

    if (result) {
      this.props.onClose();
    }
  };

  render() {
    const { onClose, intl } = this.props;
    const type = this.props.bankAccount !== undefined
      ? intl.formatMessage({ id: 'dashboard.settings.deleteConfirm.bankAccount' })
      : intl.formatMessage({ id: 'dashboard.settings.deleteConfirm.wallet' });

    const wallet = this.props.bankAccount !== undefined ? this.props.bankAccount : this.props.wallet;

    return (
      <ModalBase onRequestClose={onClose}>
        <ModalBase.Title>
          <FormattedMessage id='dashboard.settings.delete.confirm' defaultMessage='Confirm' />
        </ModalBase.Title>

        <p className='modal-note' style={{fontSize: '16px'}}>
          {intl.formatMessage({ id: 'dashboard.settings.deleteConfirm.description' })} {type}?
        </p>

        <div className='d-flex'>
          <Button className='dashboard-btn dashboard-btn--modal mr-5' onClick={this.deleteWallet}>
            <FormattedMessage id='dashboard.yes' defaultMessage='Yes' />
          </Button>
          <Button className='dashboard-btn dashboard-btn--modal' onClick={onClose}>
            <FormattedMessage id='dashboard.no' defaultMessage='No' />
          </Button>
        </div>
      </ModalBase>
    );
  }
}

export default injectIntl(DeleteConfirmModal);