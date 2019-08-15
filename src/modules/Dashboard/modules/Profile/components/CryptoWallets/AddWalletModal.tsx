import * as React from 'react';
import ModalBase from '../../../../../Modals/components/ModalBase';
import Button from '../../../../../Shared/components/Buttons/Button';
import Input from '../../../../../Shared/components/Inputs/Input';
import { lazyInject } from '../../../../../IoC';
import { CryptoWalletsStore } from '../../stores/CryptoWalletsStore';
import { ICryptoWallet } from '../../interfaces/ICryptoWallet';
import { observer } from 'mobx-react';
import { FormattedMessage, injectIntl, InjectedIntlProps  } from 'react-intl';

interface IProps {
  onClose: () => void;
}

@observer
class AddWalletModal extends React.Component<IProps & InjectedIntlProps> {
  @lazyInject(CryptoWalletsStore)
  private readonly store: CryptoWalletsStore;

  componentWillUnmount(): void {
    this.store.UI.resetFields();
  }

  handleChange = ({ name, value }) => this.store.UI.changeField(name, value);

  addWallet = async () => {
    this.store.UI.validateForm();
    if (!this.store.UI.isFormValid) {
      return;
    }

    const wallet: ICryptoWallet = {
      label: this.store.UI.fields.label.value as string,
      address: this.store.UI.fields.address.value as string,
    };

    await this.store.addWallet(wallet);
    if (!this.store.UI.isFormValid) {
      return;
    }

    this.props.onClose();
  };

  render() {
    const { onClose, intl } = this.props;
    const { label, address } = this.store.UI.fields;

    return (
      <ModalBase onRequestClose={onClose}>
        <ModalBase.Title>
          <FormattedMessage id='dashboard.settings.addWallet.title'
            defaultMessage='Add cryptocurrency wallet'
          />
        </ModalBase.Title>
        <Input
          name='label'
          label={intl.formatMessage({
            id: 'dashboard.settings.addWallet.label',
            defaultMessage: 'Label',
          })}
          placeholder={intl.formatMessage({
            id: 'dashboard.settings.addWallet.labelPlaceholder',
            defaultMessage: 'Enter wallet label (optional)',
          })}
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
          placeholder={intl.formatMessage({
            id: 'dashboard.settings.addWallet.addressPlaceholder',
            defaultMessage: 'Enter wallet address',
          })}
          showError={!!address.error}
          errorMessage={address.error}
          onChange={this.handleChange}
        />
        <Button className='dashboard-btn dashboard-btn--modal' onClick={this.addWallet}>
          <FormattedMessage id='dashboard.settings.add' defaultMessage='Add' />
        </Button>
      </ModalBase>
    );
  }
}

export default injectIntl(AddWalletModal);