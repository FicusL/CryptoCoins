import * as React from 'react';
import Button from '../../../../../Shared/components/Buttons/Button';
import Modal from '../../../../../Shared/components/Modal/ModalBase';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { Link } from 'react-router-dom';

export interface ILinkSentProps {
  isOpen: boolean;
  onSubmit?: () => void;
}

class RequestResetPasswordLinkSent extends React.Component<ILinkSentProps & InjectedIntlProps> {
  render() {
    const { intl } = this.props;
    return (
      <Modal isOpen={this.props.isOpen}  hideCloseIcon disableOverlay>
        <Modal.Title>
            {intl.formatMessage({
                id: 'authorization.request.reset.password.link.sent.modal.title',
                defaultMessage: 'Success',
            })}
        </Modal.Title>

        <p className='text-center'>
            {intl.formatMessage({
                id: 'authorization.request.reset.password.link.sent.modal.text',
                defaultMessage: 'Reset link was sent to your email',
            })}
        </p>

        <i className='icon icon-checkmark mx-auto mb-4' />

        <Link to='/login'>
          <Button className='dashboard-btn dashboard-btn--modal' onClick={this.props.onSubmit}>
              {intl.formatMessage({
                  id: 'authorization.request.reset.password.link.sent.modal.button',
                  defaultMessage: 'Go to login',
              })}
          </Button>
        </Link>
      </Modal>
    );
  }
}

export default injectIntl(RequestResetPasswordLinkSent);