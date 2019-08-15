import * as React from 'react';
import DashboardNavbar from '../DashboardNavbar';
import InfoStrip from '../../../Shared/components/InfoStrip';
import { lazyInject } from '../../../IoC';
import { AccountStore } from '../../modules/Profile/stores/AccountStore';
import { observer } from 'mobx-react';
import Layout from '../../../Shared/components/Layout/Layout';
import PaymentMethodsContainer from '../../../../modules/Dashboard/modules/PaymentMethods/containers/PaymentMethodsContainer';
import Footer from '../../../Landing/components/Footer/Footer';

@observer
export default class DashboardLayout extends React.Component {

  @lazyInject(AccountStore)
  store: AccountStore;

  componentDidMount() {
    this.store.fetchAccountData().then(() => {
      if (this.store.isPartner) {
        this.store.getReferralsCount();
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        <DashboardNavbar/>
        <InfoStrip />
        <Layout>
          {this.props.children}
        </Layout>
        <Footer />

        <PaymentMethodsContainer />
      </React.Fragment>
    );
  }
}