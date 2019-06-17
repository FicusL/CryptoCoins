import * as React from 'react';
import { ICryptoWallet } from '../../interfaces/ICryptoWallet';
import ModalBase from '../../../../../Modals/components/ModalBase';
import Button from '../../../../../Shared/components/Buttons/Button';
import Input from '../../../../../Shared/components/Inputs/Input';
import { CryptoWalletsStore } from '../../stores/CryptoWalletsStore';
import { lazyInject } from '../../../../../IoC';
import { observer } from 'mobx-react';
import { FormattedMessage, injectIntl, InjectedIntlProps  } from 'react-intl';
import { ModalStore } from '../../../../../Modals/store/ModalStore';

interface IProps {
  wallet: ICryptoWallet;
  onClose: () => void;
}

@observer
class UpdateWalletModal extends React.Component<IProps & InjectedIntlProps> {
  @lazyInject(CryptoWalletsStore)
  private readonly store: CryptoWalletsStore;

  @lazyInject(ModalStore)
  private readonly modalStore: ModalStore;

  constructor(props) {
    super(props);

    this.store.UI.updateFields({
      label: this.props.wallet.label,
      address: this.props.wallet.address,
    });
  }

  componentWillUnmount(): void {
    this.store.UI.resetFields();
  }

  handleChange = ({ name, value }) => this.store.UI.changeField(name, value);

  updateWallet = async () => {
    this.store.UI.validateForm();
    if (!this.store.UI.isFormValid) {
      return;
    }

    const wallet: ICryptoWallet = {
      id: this.props.wallet.id,
      label: this.store.UI.fields.label.value as string,
      address: this.store.UI.fields.address.value as string,
    };

    await this.store.updateWallet(wallet);
    if (!this.store.UI.isFormValid) {
      return;
    }

    this.props.onClose();
  };

  deleteWallet = async () => {
    const result = await this.store.deleteWallet(this.props.wallet);
    if (result) {
      this.props.onClose();
    }
  };

  render() {
    const { onClose, wallet, intl } = this.props;
    const { label, address } = this.store.UI.fields;
    return (
      <ModalBase onRequestClose={onClose}>
        <ModalBase.Title>
          <FormattedMessage id='dashboard.settings.change.cryptoWallet.title' defaultMessage='Cryptocurrency wallet' />
        </ModalBase.Title>
        <Input
          name='label'
          label={intl.formatMessage({
            id: 'dashboard.settings.addWallet.label',
            defaultMessage: 'Label',
          })}
          value={label.value}
          showError={!!label.error}
          errorMessage={label.error}
          onChange={this.handleChange}
        />
        <Input
          name='address'
          label={intl.formatMessage({
          id: 'dashboard.settings.addWallet.address',
          defaultMessage: 'Address',
        })}
          value={address.value}
          showError={!!address.error}
          errorMessage={address.error}
          onChange={this.handleChange}
        />

        <Button className='dashboard-btn dashboard-btn--modal' onClick={this.updateWallet}>
          <FormattedMessage id='dashboard.settings.change' defaultMessage='Change' />
        </Button>
        <div className='text--center'>
          <span className='modal__secondary-action' onClick={() =>
            this.modalStore.openModal('DELETE_CONFIRM', {wallet})}>
            <FormattedMessage id='dashboard.settings.deleteWallet' defaultMessage='Delete wallet' />
          </span>
        </div>
      </ModalBase>
    );
  }
}

export default injectIntl(UpdateWalletModal);