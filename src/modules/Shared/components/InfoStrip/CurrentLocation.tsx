import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { injectIntl } from 'react-intl';

interface ILocationProps {
  intl: ReactIntl.InjectedIntl;
}

class CurrentLocation extends React.Component<ILocationProps>{
  constructor(props) {
    super(props);
  }

  public render() {
    const {intl} = this.props;
    return (
      <Switch>
        <Route exact path='/dashboard' render={() =>
          intl.formatMessage({id: 'dashboard.main.title'})
        }/>
        <Route exact path='/dashboard/confirmation' render={() =>
          intl.formatMessage({id: 'dashboard.confirmation.title'})
        }/>
        <Route exact path='/dashboard/progress' render={() =>
          intl.formatMessage({id: 'dashboard.operationProcess.title'})
        }/>
        <Route exact path='/dashboard/verification/tier1' render={() =>
          intl.formatMessage({id: 'dashboard.tier1Verification.title'})
        }/>
        <Route exact path='/dashboard/verification/tier2' render={() =>
          intl.formatMessage({id: 'dashboard.tier2Verification.title'})
        }/>
        <Route exact path='/dashboard/verification' render={() =>
          intl.formatMessage({id: 'dashboard.KYC.title'})
        }/>
        <Route exact path='/dashboard/transactions' render={() =>
          intl.formatMessage({id: 'dashboard.transactions.title'})
        }/>
        <Route exact path='/dashboard/paymentdetails' render={() =>
          intl.formatMessage({id: 'dashboard.paymentDetails.title'})
        }/>
        <Route exact path='/dashboard/profile' render={() =>
          intl.formatMessage({id: 'dashboard.profile.title'})
        }/>
        <Route exact path='/dashboard/referral_program' render={() =>
          intl.formatMessage({id: 'dashboard.main.referralTitle'})
        }/>
      </Switch>
    );
  }
}

export default injectIntl(CurrentLocation);