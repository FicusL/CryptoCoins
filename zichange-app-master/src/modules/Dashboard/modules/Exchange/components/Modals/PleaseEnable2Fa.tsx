import * as React from 'react';
import ModalBase from '../../../../../Modals/components/ModalBase';
import Button from '../../../../../Shared/components/Buttons/Button';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';

interface IProps {
  onClose?: () => void;
}

class PleaseEnable2Fa extends React.Component<IProps & RouteComponentProps> {

  goToProfileHandler = () => {
    this.props.history.push('/dashboard/profile');
    this.props.onClose();
  };

  public render() {
    const { onClose } = this.props;

    return (
      <ModalBase onRequestClose={onClose}>
        <ModalBase.Title>
          <FormattedMessage id='dashboard.2FaEnabled.title' defaultMessage='2FA not enabled!' />
        </ModalBase.Title>

        <p className='modal-note'>
          <FormattedMessage
            id='dashboard.2FaEnabled.note'
            defaultMessage='You need to enable Two-Factor Authentication to start exchange.'
          />
        </p>

        <i className='icon icon-security mx-auto mb-4' />

        <div className='whatIs2fa'>
          <a target='_blank' href={`${window.location.origin}/2fa-info`}>
            <FormattedMessage id='authorization.2fa.whatIs2fa'/>
          </a>
        </div>

        <Button className='dashboard-btn dashboard-btn--modal' onClick={this.goToProfileHandler}>
          <FormattedMessage id='dashboard.goToProfile' defaultMessage='Go to profile' />
        </Button>
      </ModalBase>
    );
  }
}

export default withRouter(PleaseEnable2Fa);