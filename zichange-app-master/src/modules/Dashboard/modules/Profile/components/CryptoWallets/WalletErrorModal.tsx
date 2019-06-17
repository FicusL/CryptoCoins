import React from 'react';
import Modal from '../../../../../Shared/components/Modal/Modal';
import { InjectedIntlProps, injectIntl } from 'react-intl';

interface IProps {
  onClose: () => void;
}

class WalletErrorModal extends React.Component<IProps & InjectedIntlProps> {
  render() {

    const { intl } = this.props;

    return(
      <Modal.Error
        title={intl.formatMessage({
        id: 'dashboard.transactions.modalError.title',
        defaultMessage: 'Error',
      })}
       description={intl.formatMessage({
         id: 'dashboard.profile.alreadyHaveCryptoWallet.description',
         defaultMessage: 'You have already linked this cryptocurrency wallet to your account.',
       })}
        onClose={this.props.onClose}/>
    );
  }
}

export default injectIntl(WalletErrorModal);