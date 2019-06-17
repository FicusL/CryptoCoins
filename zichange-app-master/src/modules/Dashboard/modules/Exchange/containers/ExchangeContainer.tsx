import './style.scss';
import * as React from 'react';
import Button from '../../../../Shared/components/Buttons/Button';
import { lazyInject } from '../../../../IoC';
import { ExchangeStore } from '../store/ExchangeStore';
import { observer } from 'mobx-react';
import { AccountStore } from '../../Profile/stores/AccountStore';
import { ModalStore } from '../../../../Modals/store/ModalStore';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { TransactionsStore } from '../../Transactions/stores/TransactionsStore';
import { LoaderStore } from '../../../../Shared/modules/Loader/store/LoaderStore';
import { WalletStore } from '../store/WalletStore';
import Balance from '../components/Balance/Balance';
import { ExchangeFields } from '../const/ExchangeFields';
import { FacadeMinAmountsStore } from '../../../../Shared/modules/MinAmounts/store/FacadeMinAmountsStore';
import { FormattedMessage } from 'react-intl';
import ExchangeForm from '../components/ExchangeForm';
import { LocaleStore } from '../../../../Shared/stores/LocaleStore';

@observer
class ExchangeContainer extends React.Component<RouteComponentProps> {
  @lazyInject(ExchangeStore)
  readonly exchangeStore: ExchangeStore;

  @lazyInject(WalletStore)
  readonly walletStore: WalletStore;

  @lazyInject(TransactionsStore)
  readonly transactionsStore: TransactionsStore;

  @lazyInject(AccountStore)
  readonly accountStore: AccountStore;

  @lazyInject(ModalStore)
  readonly modalStore: ModalStore;

  @lazyInject(LoaderStore)
  readonly loaderStore: LoaderStore;

  @lazyInject(FacadeMinAmountsStore)
  readonly facadeMinAmountsStore: FacadeMinAmountsStore;

  handleConfirm = () => {
    if (!this.accountStore.validateKYCStatus()) {
      return;
    }

    if (!this.accountStore.twoFaEnabled) {
      this.props.history.push('/dashboard/profile');
      this.modalStore.openModal('PLEASE_ENABLE_2FA');
      return;
    }

    this.exchangeStore.validateFrom();
    this.exchangeStore.validateTo();
    if (!this.exchangeStore.isValid) {
      return;
    }
    this.exchangeStore.fetchFee();

    this.exchangeStore.freeze(ExchangeFields.From);
    this.props.history.push('/dashboard/confirmation', { fromExchange: true });
  };

  componentWillMount() {
    this.facadeMinAmountsStore.requestMinAmounts();

    this.walletStore.fetchBalances();
    this.transactionsStore.loadTransactions();
  }

  render() {

    if (this.loaderStore.isLoaderActive) {
      return (
        <div/>
      );
    }

    return (
      <div className='exchange__container'>
        <h2 className='exchange__container__title text-center text-md-left'>
          <FormattedMessage id='dashboard.exchange.title' defaultMessage='Exchange' />
        </h2>

        <ExchangeForm />

        <div className='d-flex justify-content-end mb-4 exchange__container__confirm__button'>
          <Button name='white' onClick={this.handleConfirm}>
            <FormattedMessage id='dashboard.exchange.title' defaultMessage='Exchange' />
          </Button>
        </div>

        <Balance
          fiatBalances={this.walletStore.fiatBalances}
          cryptoBalances={this.walletStore.cryptoBalances}
        />
      </div>
    );
  }
}

export default withRouter(ExchangeContainer);