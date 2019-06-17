import * as React from 'react';
import TransactionProgress from '../components/TransactionProgess';
import { lazyInject } from '../../IoC';
import {
  TransactionProgressStore,
} from '../components/TransactionProgess/stores/TransactionProgressStore';
import AuthorizationContainer from '../modules/Authorization/AuthorizationContainer';
import PaymentContainer from '../modules/PaymentMethod/PaymentContainer';
import { observer } from 'mobx-react';
import VerificationContainer from '../modules/Verification/VerificationContainer';
import StatusContainer from '../modules/Status/StatusContainer';
import { LoaderStore } from '../../Shared/modules/Loader/store/LoaderStore';

@observer
class CounterpartyContainer extends React.Component {

  @lazyInject(TransactionProgressStore)
  store: TransactionProgressStore;

  @lazyInject(LoaderStore)
  loaderStore: LoaderStore;

  forms = [
    AuthorizationContainer,
    VerificationContainer,
    PaymentContainer,
    StatusContainer,
  ];

  render() {
    const Form = this.forms[this.store.stepIndex];

    return(
      <div className='container' style={{marginTop: '60px'}}>
        <TransactionProgress stepIndex={this.store.stepIndex}>
          <Form />
        </TransactionProgress>
      </div>
    );
  }
}

export default CounterpartyContainer;