import * as React from 'react';
import Button from '../../../../../Shared/components/Buttons/Button';
import ModalBase from '../../../../../Modals/components/ModalBase';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';


interface IProps {
  onClose?: () => void;
}

export default class ExchangeUnapprovedModal extends React.Component<IProps> {

  public render() {
    const { onClose } = this.props;

    return (
      <ModalBase onRequestClose={onClose}>
        <ModalBase.Title>
          <FormattedMessage
            id='dashboard.exchangeUnapproved.title'
            defaultMessage='KYC verification is unapproved'
          />
        </ModalBase.Title>

        <p className='modal-note'>
          <FormattedMessage
            id='dashboard.exchangeUnapproved.description'
            defaultMessage='verify your identity to start trading.'
          />
        </p>

        <i className='icon icon-kyc-sent mx-auto mb-4' />
        <Link to='/dashboard/verification/tier1'>
          <Button className='dashboard-btn dashboard-btn--modal' onClick={onClose}>
            <FormattedMessage
              id='dashboard.exchangeUnapproved.startTier1'
              defaultMessage='Start Verification'
            />
          </Button>
        </Link>
      </ModalBase>
    );
  }
}