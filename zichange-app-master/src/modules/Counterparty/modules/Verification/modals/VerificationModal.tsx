import * as React from 'react';
import { lazyInject } from '../../../../IoC';
import { TransactionProgressStore } from '../../../components/TransactionProgess/stores/TransactionProgressStore';
import { observer } from 'mobx-react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import './style.scss';

interface IProps {
  onClose?: () => void;
}

@observer
class VerificationModal extends React.Component<IProps & InjectedIntlProps> {

  @lazyInject(TransactionProgressStore)
  store: TransactionProgressStore;

  render() {

    const { intl } = this.props;

    return(
      <div className='modal mt-5'>
        <h2 className='modal__title'>
          {intl.formatMessage({
            id: 'counterparties.verification.modal.header',
          })}
        </h2>
        <div className='d-flex justify-content-center verify-identity'>
          <div className='verify-identity__card'>
            <i className='icon icon-simple' />
            <div className='col advantage'>
              <h3 className='advantage-title'>
                <FormattedMessage id='dashboard.kyc.advantageTitle2' defaultMessage='SIMPLE' />
              </h3>
              <p className='advantage-description'>
                <FormattedMessage
                  id='dashboard.kyc.advantageDescription2'
                  defaultMessage='Verification process is very simple and it would not take you much time.' />
              </p>
            </div>
          </div>
        </div>

        <p>
          {intl.formatMessage({
            id: 'counterparties.verification.modal.body',
          })}
        </p>
      </div>
    );
  }
}

export default injectIntl(VerificationModal);
