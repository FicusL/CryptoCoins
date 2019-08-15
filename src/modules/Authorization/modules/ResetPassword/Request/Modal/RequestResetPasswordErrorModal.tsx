import React from 'react';
import Modal from '../../../../../Shared/components/Modal/Modal';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { observer } from 'mobx-react';

interface IProps {
  onClose?: () => void;
}

@observer
class RequestResetPasswordErrorModal extends React.Component<IProps & InjectedIntlProps> {
  render() {

    const { intl, onClose } = this.props;

    return(
      <Modal.Error
        title={intl.formatMessage({
          id: 'authorization.validation.emailNotFound.title',
          defaultMessage: 'Email not found',
        })}
        description={intl.formatMessage({
          id: 'authorization.validation.emailNotFound',
          defaultMessage: 'No account found with that email address',
        })}
        onClose={onClose}
      />
    );
  }
}

export default injectIntl(RequestResetPasswordErrorModal);