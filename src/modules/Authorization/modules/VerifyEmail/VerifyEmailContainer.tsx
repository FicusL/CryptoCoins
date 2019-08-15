import * as React from 'react';
import { observer } from 'mobx-react';
import { injectIntl, FormattedMessage, InjectedIntlProps } from 'react-intl';
import { lazyInject } from '../../../IoC';
import { VerifyEmailStore } from './VerifyEmailStore';
import Button from '../../../Shared/components/Buttons/Button';
import Modal from '../../../Shared/components/Modal/ModalBase';
import { Link } from 'react-router-dom';

export interface IVerifyEmailContainerProps {
  token: string;
}

@observer
class VerifyEmailContainer extends React.Component<IVerifyEmailContainerProps & InjectedIntlProps> {
  @lazyInject(VerifyEmailStore)
  private readonly verifyEmailStore: VerifyEmailStore;

  componentDidMount() {
    const { token } = this.props;
    this.verifyEmailStore.verify(token);
  }

  componentWillUnmount() {
    this.verifyEmailStore.reset();
  }

  render() {
    return (
      <Modal isOpen={true} hideCloseIcon={true}>
        <Modal.Title>
          <FormattedMessage id='authorization.accountActivation' />
        </Modal.Title>

        <p className='text-center'>
          {this.verifyEmailStore.isTokenValid ?
            <div>
              <FormattedMessage id='authorization.accountActivationSuccess' />
              <br />
              <FormattedMessage id='authorization.accountActivationSuccessTip' />
            </div>
            :
            <div>
              <FormattedMessage id='authorization.accountActivationFail' />
              <br />
              <FormattedMessage id='authorization.accountActivationFailTip' />
            </div>
          }
        </p>

        <i className='icon icon-kyc-sent mx-auto mb-4' />

        <form>
          <Link to='/login'>
            <Button className='dashboard-btn dashboard-btn--modal'>
              <FormattedMessage id='authorization.clickToContinue' />
            </Button>
          </Link>
        </form>
      </Modal>
    );
  }
}

export default injectIntl(VerifyEmailContainer);