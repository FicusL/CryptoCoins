import * as React from 'react';
import Button from '../../../../../Shared/components/Buttons/Button';
import ModalBase from '../../../../../Modals/components/ModalBase';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';


interface IProps {
  rejectReason: string;
  onClose?: () => void;
}

export default class ExchangeRejectReasonModal extends React.Component<IProps> {

  public render() {
    const { rejectReason, onClose } = this.props;

    return (
      <ModalBase onRequestClose={onClose}>
        <ModalBase.Title>
          <FormattedMessage
            id='dashboard.exchangeRejectReason.title'
            defaultMessage='KYC verification has been rejected'
          />
        </ModalBase.Title>

        <p className='modal-note'>
          <FormattedMessage id='dashboard.exchangeRejectReason.description'/>:&nbsp;
          {rejectReason}. <FormattedMessage id='dashboard.exchangeRejectReason.submitTierAgain '/>
        </p>

        <i className='icon icon-kyc-sent mx-auto mb-4' />
        <Link to='/dashboard/verification/tier1'>
          <Button className='dashboard-btn dashboard-btn--modal' onClick={onClose}>
            <FormattedMessage
              id='dashboard.exchangeRejectReason.retryVerification'
              defaultMessage='Retry verification'
            />
          </Button>
        </Link>
      </ModalBase>
    );
  }
}