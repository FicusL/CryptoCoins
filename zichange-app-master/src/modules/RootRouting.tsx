import * as React from 'react';

import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { observer } from 'mobx-react';

import SessionAuth from './Shared/containers/SessionAuth/SessionAuth';
import Loader from './Shared/modules/Loader/containers';
import DashboardRouting from './Dashboard/DashboardRouting';
import AuthRouting from './Authorization/AuthRouting';
import { LocaleStore } from './Shared/stores/LocaleStore';
import { SessionStore } from './Shared/stores/SessionStore';

import { lazyInject } from './IoC';
import { StaticContext } from 'react-router';
import ModalContainer from './Modals/containers/ModalContainer';
import LandingContainer from './Landing/containers/LandingContainer';
import PaymentsSecurity from './PolicyPages/PaymentsSecurity';
import RefundPolicy from './PolicyPages/RefundPolicy';
import Fees from './PolicyPages/Fees';
import TwoFaInfo from './Dashboard/modules/Profile/components/2FAInfo';
import Referral from './Referral/components/Referral';
import { LoaderStore } from './Shared/modules/Loader/store/LoaderStore';
import CookieBanner from './Shared/components/CookieBanner';
import CounterpartyLayout from './Counterparty/components/Layout';
import AntiFraudPolicy from './PolicyPages/AntiFraudPolicy';
import KycAmlPolicy from './PolicyPages/KycAmlPolicy';
import ReSendCodeModal from './Counterparty/modules/Authorization/modals/ReSendCodeModal';

const { Suspense, lazy } = React;
const LazyAdmin = lazy(() => import('./Admin'));

@observer
class RootRouting extends React.Component<any, StaticContext> {
  @lazyInject(LocaleStore)
  localeStore: LocaleStore;

  @lazyInject(SessionStore)
  sessionStore: SessionStore;

  @lazyInject(LoaderStore)
  loaderStore: LoaderStore;

  public render() {
    const { locale, messages } = this.localeStore;

    const canAccessDashboard = this.sessionStore.canAccessDashboard;
    const canAccessAuth = !canAccessDashboard;

    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        <React.Fragment>
          <Loader>
            <SessionAuth>
              <ModalContainer />
              <Suspense fallback='Loading...'>
                <Switch>
                  {this.sessionStore.canAccessAdmin && <Route path='/admin' render={() => <LazyAdmin />} />}

                  <Route exact path='/counterparties/:accountId/transactions/:token' component={(props) =>
                    <CounterpartyLayout accountId={props.match.params.accountId} token={props.match.params.token} />
                  } />

                  <Route exact path='/counterparties/:accountId/transactions/:token/verify&code=:activateCode' component={(props) =>
                      <CounterpartyLayout accountId={props.match.params.accountId} token={props.match.params.token}
                                          activateCode={props.match.params.activateCode} />
                  } />

                  <Route exact path='/ru' component={() => <LandingContainer />} />

                  <Route exact path='/counterparties/:accountId/transactions/:token/resend_code' component={ReSendCodeModal} />

                  <Route exact path='/referral' component={Referral} />

                  <Route exact path='/payments-security' component={PaymentsSecurity} />
                  <Route exact path='/refund-policy' component={RefundPolicy} />
                  <Route exact path='/kyc-aml-policy' component={KycAmlPolicy} />
                  <Route exact path='/fees-deposits' component={Fees} />
                  <Route exact path='/anti-fraud-policy' component={AntiFraudPolicy} />
                  <Route exact path='/2fa-info' component={TwoFaInfo} />

                  <Route exact path='/payments-security' component={PaymentsSecurity} />
                  <Route exact path='/refund-policy' component={RefundPolicy} />
                  <Route exact path='/fees-deposits' component={Fees} />

                  <Route exact path='/' render={() => (
                    !canAccessDashboard ?
                      <LandingContainer /> :
                      <Redirect to='/dashboard'/>
                  )}/>

                  <Route path='/dashboard' render={() => (
                    canAccessDashboard ?
                      <DashboardRouting /> :
                      <Redirect to='/login' />
                  )}/>
                  <Route path='/' render={() => (
                    canAccessAuth ?
                      <AuthRouting/>  :
                      <Redirect to='/dashboard' />
                  )}/>
                </Switch>
              </Suspense>
            </SessionAuth>
          </Loader>

          <CookieBanner />
        </React.Fragment>
      </IntlProvider>
    );
  }
}

export default withRouter(RootRouting);
