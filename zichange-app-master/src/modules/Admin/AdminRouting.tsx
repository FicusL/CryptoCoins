import * as React from 'react';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router';
import TransactionsRouting from './modules/Transactions/TransactionsRouting';
import KycRouting from './modules/KYC/KycRouting';
import { observer } from 'mobx-react';
import ApiKeysContainer from './modules/Counterparty/containers/ApiKeysContainer';
import ClientsContainer from './modules/Counterparty/containers/ClientsContainer';
import ClientsTransactionsContainer from './modules/Counterparty/containers/ClientsTransactionsContainer';
import { lazyInject } from '../IoC';
import { SessionStore } from '../Shared/stores/SessionStore';
import DashboardContainer from './modules/Counterparty/containers/DashboardContainer';
import WhiteListIpContainer from './modules/Counterparty/containers/WhiteListIpContainer';
import SettingsContainer from './modules/Counterparty/containers/SettingsContainer';
import AdminClientsContainer from './modules/Clients/AdminClientsContainer';

@observer
class AdminRouting extends React.Component<RouteComponentProps> {

  @lazyInject(SessionStore)
  sessionStore: SessionStore;

  render() {
    return (
      <Switch>

        <Route path='/admin/kyc' component={KycRouting} />

        <Route path='/admin/dashboard' component={DashboardContainer} />
        <Route path='/admin/settings' component={SettingsContainer} />
        <Route path='/admin/white_list_ip' component={WhiteListIpContainer} />
        <Route path='/admin/api_keys' component={ApiKeysContainer} />

        {this.sessionStore.isAdmin
          ? <Route path='/admin/clients' component={AdminClientsContainer} />
          : <Route path='/admin/clients' component={ClientsContainer} />
        }

        {this.sessionStore.isCounterparty
          ? <Route path='/admin/transactions' component={ClientsTransactionsContainer} />
          : this.sessionStore.isAdmin && <Route path='/admin/transactions' component={TransactionsRouting} />
        }
      </Switch>
    );
  }
}

export default withRouter(AdminRouting) as React.ComponentClass<{}>;
