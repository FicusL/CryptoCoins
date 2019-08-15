import * as React from 'react';
import { Route, Switch } from 'react-router';
import KycContainer from './containers/KycContainer';
import KycApproved from './components/KycStatuses/KycApproved';
import KycPending from './components/KycStatuses/KycPending';
import KycRejected from './components/KycStatuses/KycRejected';
import KycAll from './components/KycStatuses/KycAll';

class KycRouting extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path='/admin/kyc/pending' component={KycPending} />
        <Route exact path='/admin/kyc/approved' component={KycApproved} />
        <Route exact path='/admin/kyc/rejected' component={KycRejected} />
        <Route exact path='/admin/kyc/all' component={KycAll} />

        <Route path='/admin/kyc/:accountId' component={KycContainer} />
      </Switch>
    );
  }
}

export default KycRouting;
