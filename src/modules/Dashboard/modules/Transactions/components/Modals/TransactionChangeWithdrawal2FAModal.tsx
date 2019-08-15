import * as React from 'react';
import Modal from '../../../../../Modals/components/ModalBase';
import { RouteComponentProps } from 'react-router';
import Input from '../../../../../Shared/components/Inputs/Input';
import Button from '../../../../../Shared/components/Buttons/Button';
import { FormattedMessage } from 'react-intl';

interface IProps {
  code: string;
  error: string;
  onClose: () => void;
  onSubmit: () => void;
  onCodeChange: (code: string) => void;
}

class TransactionChangeWithdrawal2FAModal extends React.Component<IProps & RouteComponentProps<any>> {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onSubmit();
  };

  render() {
    return (
      <Modal onRequestClose={this.props.onClose}>
        <Modal.Title>
          <FormattedMessage
            id='dashboard.2FaEnabled.confirmOperationWith2FA'
            defaultMessage='Confirm operation with 2FA code'
          />
        </Modal.Title>
        <form onSubmit={this.handleSubmit}>
          <Input
            name='twoFa'
            type='text'
            value={this.props.code}
            errorMessage={this.props.error}
            showError={!!this.props.error}
            onChange={({ value }) => this.props.onCodeChange(value)}
          />

          <Button className='dashboard-btn dashboard-btn--modal mt-5' type='submit'>
            <FormattedMessage id='dashboard.confirm' defaultMessage='Confirm' />
          </Button>
        </form>
      </Modal>
    );
  }
}

export default TransactionChangeWithdrawal2FAModal;