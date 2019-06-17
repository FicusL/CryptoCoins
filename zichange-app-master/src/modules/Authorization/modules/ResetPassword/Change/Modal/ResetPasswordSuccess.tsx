import * as React from 'react';
import Button from '../../../../../Shared/components/Buttons/Button';
import { injectIntl, FormattedMessage, InjectedIntlProps } from 'react-intl';
import Modal from '../../../../../../modules/Shared/components/Modal/ModalBase';
import { FormEventHandler } from 'react';

export interface IResetPasswordSuccessProps {
  isOpen: boolean;
  onSubmit: FormEventHandler<any>;
}

class ResetPasswordSuccess extends React.Component<IResetPasswordSuccessProps & InjectedIntlProps> {
  render() {
    return (
      <Modal isOpen={this.props.isOpen} hideCloseIcon disableOverlay>
        <Modal.Title>
          <FormattedMessage id='authorization.resetPasswordSuccessTitle' />
        </Modal.Title>

        <i className='icon icon-checkmark mx-auto mb-4' />

        <Button className='dashboard-btn dashboard-btn--modal' onClick={this.props.onSubmit}>
          <FormattedMessage id='authorization.backToLogin' />
        </Button>
      </Modal>
    );
  }
}

export default injectIntl(ResetPasswordSuccess);