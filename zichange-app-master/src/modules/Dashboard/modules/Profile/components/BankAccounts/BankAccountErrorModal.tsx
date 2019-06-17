import { InjectedIntlProps, injectIntl } from 'react-intl';
import React from 'react';
import Modal from '../../../../../Shared/components/Modal/Modal';

interface IProps {
  onClose: () => void;
}

class BankAccountErrorModal extends React.Component<IProps & InjectedIntlProps> {
  render() {

    const { intl, onClose } = this.props;

    return(
      <Modal.Error
        title={intl.formatMessage({
          id: 'dashboard.transactions.modalError.title',
          defaultMessage: 'Error',
        })}
        description={intl.formatMessage({
          id: 'dashboard.profile.alreadyHaveBankAccount.description',
          defaultMessage: 'You have already added this bank account.',
        })}
        onClose={onClose}
      />
    );
  }
}

export default injectIntl(BankAccountErrorModal);