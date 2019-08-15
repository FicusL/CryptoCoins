import * as React from 'react';
import Tier1Container from '../../../Dashboard/modules/Verification/NaturalVerification/containers/Tier1Container';
import { lazyInject } from '../../../IoC';
import { ModalStore } from '../../../Modals/store/ModalStore';
import { CounterpartyTransactionSteps } from '../../components/TransactionProgess/const/CounterpartyTransactionSteps';
import { TransactionProgressStore } from '../../components/TransactionProgess/stores/TransactionProgressStore';
import VerificationModal from './modals/VerificationModal';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { VerificationStore } from './stores/VerificationStore';
import { observer } from 'mobx-react';

@observer
class VerificationContainer extends React.Component<InjectedIntlProps> {

  @lazyInject(ModalStore)
  private readonly modalStore: ModalStore;

  @lazyInject(VerificationStore)
  verificationStore: VerificationStore;

  @lazyInject(TransactionProgressStore)
  transactionSteps: TransactionProgressStore;

  componentWillMount(): void {
    this.verificationStore.getKyc();
  }

  render() {

    const { intl } = this.props;

    return(
      <div className='container'>
        {this.transactionSteps.step === CounterpartyTransactionSteps.KycPending ?
            <div className='d-flex justify-content-center'>
              <VerificationModal />
            </div> :
            <div>
              <div className='mt-5 mb-5'>
                <h1 style={{fontSize: '18px'}}>
                  {intl.formatMessage({
                    id: 'counterparties.verification.header',
                  })}
                </h1>
                <p>
                  {intl.formatMessage({
                    id: 'counterparties.verification.body',
                  })}
                </p>
              </div>
              {this.verificationStore.kycRejectedMessage &&
                <p className='mb-3' style={{color: '#cc0000'}}>
                  {intl.formatMessage({
                    id: 'counterparties.verification.rejectReason',
                    defaultMessage: 'Your KYC application was rejected',
                  })}:&nbsp;
                  {this.verificationStore.kycRejectedMessage}
                </p>
              }
              <Tier1Container />
            </div>}
      </div>
    );
  }
}

export default injectIntl(VerificationContainer);
