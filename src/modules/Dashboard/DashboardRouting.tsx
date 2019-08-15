import * as React from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import ProfileContainer from './modules/Profile/containers/ProfileContainer';
import TransactionsContainer from './modules/Transactions/containers/TransactionsContainer';
import DashboardLayout from './components/DashboardLayout';
import { lazyInject } from '../IoC';
import { SessionStore } from '../Shared/stores/SessionStore';
import { observer } from 'mobx-react';
import { StaticContext } from 'react-router';
import ExchangeContainer from './modules/Exchange/containers/ExchangeContainer';
import Tier2Container from './modules/Verification/Tier2Verification/components';
import ExchangeConfirmationContainer from './modules/Exchange/containers/ExchangeConfirmationContainer';
import { AccountStore } from './modules/Profile/stores/AccountStore';
import { KycStatus } from './modules/Profile/constants/KycStatus';
import Tier1Container from './modules/Verification/NaturalVerification/containers/Tier1Container';
import { FacadeCurrenciesStore } from '../Shared/modules/Currencies/store/FacadeCurrenciesStore';
import { AccountType } from '../Shared/const/AccountType';
import LegalVerificationContainer from './modules/Verification/LegalVerification/containers/LegalVerificationContainer';
import Tier3Container from './modules/Verification/Tier3Verification/components';
import StartVerification from './modules/Verification/StartVerification';
import PaymentSuccess from '../../modules/Dashboard/modules/Transactions/containers/PaymentSuccess';
import PaymentFail from '../Dashboard/modules/Transactions/containers/PaymentFail';
import TransactionDetails from './modules/Transactions/containers/PaymentDetails/TransactionFullDetails';
import ReferralProgram from './modules/ReferralProgram/containers/ReferralProgram';

@observer
class DashboardRouting extends React.Component<any, StaticContext> {
  @lazyInject(SessionStore)
  readonly sessionStore : SessionStore;

  @lazyInject(AccountStore)
  readonly accountStore : AccountStore;

  @lazyInject(FacadeCurrenciesStore)
  readonly availableCurrenciesStore: FacadeCurrenciesStore;

  componentWillMount() {
    this.availableCurrenciesStore.requestAvailableCurrencies();
  }

  render() {
    const isAccountLoaded = this.accountStore.isAccountLoaded;
    if (!isAccountLoaded) {
      return (<DashboardLayout/>);
    }

    const kycStatus = this.accountStore.kyc.status;
    const accountType = this.accountStore.accountType;
    const { isPartner, kycForbiddenSend } = this.accountStore;

    return (
      <DashboardLayout>
        <Switch>

          <Route path='/dashboard/verification/tier1' render={() => (
            (kycStatus === KycStatus.Unapproved || kycStatus === KycStatus.Tier1Rejected) && !kycForbiddenSend
            ?  (accountType === AccountType.Natural)
              ? <Tier1Container/>
              : <LegalVerificationContainer />
            :  <Redirect to='/dashboard'/>
          )} />

          <Route path='/dashboard/verification/tier2' render={() => (
            (kycStatus === KycStatus.Tier1Approved || kycStatus === KycStatus.Tier2Rejected) && !kycForbiddenSend
              ? <Tier2Container/>
              : <Redirect to='/dashboard'/>
          )} />

          <Route path='/dashboard/verification/tier3' render={() => (
            (kycStatus === KycStatus.Tier2Approved || kycStatus === KycStatus.Tier3Rejected) && !kycForbiddenSend
              ? <Tier3Container/>
              : <Redirect to='/dashboard'/>
          )} />

          <Route exact path='/dashboard' component={ExchangeContainer}/>

          <Route exact path='/dashboard/verification' render={() => (
            kycStatus === KycStatus.Tier1Pending || kycStatus === KycStatus.Tier3Approved || kycForbiddenSend
              ? <Redirect to='/dashboard'/>
              : <StartVerification/>
          )} />

          <Route path='/dashboard/profile' component={ProfileContainer}/>
          <Route path='/dashboard/confirmation' component={ExchangeConfirmationContainer}/>

          <Route path='/dashboard/referral_program' render={() => (
            isPartner
              ? <ReferralProgram />
              : <Redirect to='/dashboard'/>
          )}/>

          <Route exact path='/dashboard/transactions' component={TransactionsContainer}/>

          <Route exact path='/dashboard/transactions/:referenceId' component={(props) =>
            <TransactionDetails referenceId={props.match.params.referenceId} />
          }/>

          <Route path='/dashboard/transactions/:referenceId/payment_success' component={(props) =>
            <PaymentSuccess referenceId={props.match.params.referenceId} />
          }/>

          <Route path='/dashboard/transactions/:referenceId/payment_fail' component={(props) =>
            <PaymentFail referenceId={props.match.params.referenceId} />
          }/>

          <Redirect to='/dashboard'/>
        </Switch>
      </DashboardLayout>

    );
  }
}
export default withRouter(DashboardRouting);