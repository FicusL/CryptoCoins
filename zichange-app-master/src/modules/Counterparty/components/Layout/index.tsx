import * as React from 'react';
import { CounterpartyNavbar } from '../Navbar';
import Layout from '../../../Shared/components/Layout/Layout';
import { lazyInject } from '../../../IoC';
import { ColorStore, REQUEST_FETCH_STYLE_TASK } from '../../../Admin/modules/Counterparty/stores/Colors/ColorStore';
import { LoaderStore } from '../../../Shared/modules/Loader/store/LoaderStore';
import CounterpartyContainer from '../../containers/CounterpartyContainer';
import { RouteComponentProps, withRouter } from 'react-router';
import { RGBA } from '../../../Shared/types/IRGBA';
import {
  CounterpartyAccountStore,
  REQUEST_AGENT_EMAIL,
  REQUEST_GET_TRANSACTION,
} from '../../stores/CounterpartyAccountStore';
import { observer } from 'mobx-react';
import { REQUEST_CURRENT_STEP, TransactionProgressStore } from '../TransactionProgess/stores/TransactionProgressStore';

interface IProps extends RouteComponentProps<null> {
  accountId: number;
  token: string;
  activateCode?: string;
}

@observer
class CounterpartyLayout extends React.Component<IProps> {

  @lazyInject(ColorStore)
  store : ColorStore;

  @lazyInject(CounterpartyAccountStore)
  accountStore: CounterpartyAccountStore;

  @lazyInject(TransactionProgressStore)
  transactionProgress: TransactionProgressStore;

  @lazyInject(LoaderStore)
  loaderStore: LoaderStore;

  componentWillMount(): void {

    this.accountStore.accountId = this.props.accountId;
    this.accountStore.token = this.props.token;
    this.accountStore.isAgent = true;
    this.accountStore.activateCode = this.props.activateCode;

    this.transactionProgress.currentStep();

    const body = document.body;
    this.store.getStyles().then(() => {
      body.style.backgroundColor = RGBA.toRGBString(this.store.styles.body.backgroundColor);
      body.style.color = RGBA.toRGBString(this.store.styles.body.color);
    });
  }
  
  render() {

    if (this.loaderStore.hasTask(REQUEST_FETCH_STYLE_TASK) || this.loaderStore.hasTask(REQUEST_CURRENT_STEP)
      || this.loaderStore.hasTask(REQUEST_AGENT_EMAIL)) {
      return null;
    }

    return(
      <>
        <CounterpartyNavbar colors={this.store.styles.header} />
        <Layout>
          <CounterpartyContainer />
        </Layout>
      </>
    );
  }
}

export default withRouter(CounterpartyLayout);