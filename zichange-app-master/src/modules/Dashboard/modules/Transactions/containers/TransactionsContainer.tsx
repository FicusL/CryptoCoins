import * as React from 'react';
import { Tabs, TransactionSortBy, TransactionSortDirection, TransactionsStore } from '../stores/TransactionsStore';
import { observer } from 'mobx-react';

import '../style/style.scss';
import { lazyInject } from '../../../../IoC';
import { AccountStore } from '../../Profile/stores/AccountStore';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import Transaction from '../components/Transaction/Transaction';
import DropdownIcon from '../../../../Shared/components/DropdownIcon/DropdownIcon';
import TransactionFilters from '../components/TransactionFilters/TransactionFilters';
import { FacadeCurrenciesStore } from '../../../../Shared/modules/Currencies/store/FacadeCurrenciesStore';
import Referral from '../components/Referral/Referral';
import Button from '../../../../Shared/components/Buttons/Button';
import classNames from 'classnames';

interface IState {
  activeTab: number;
  modalOpen: boolean;
  address: string;
}

@observer
class TransactionsContainer extends React.Component<InjectedIntlProps, IState> {

  constructor(props) {
    super(props);

    this.state = {
      activeTab: 0,
      modalOpen: false,
      address: '',
    };
  }

  @lazyInject(TransactionsStore)
  readonly store: TransactionsStore;

  @lazyInject(AccountStore)
  readonly accountStore: AccountStore;

  @lazyInject(FacadeCurrenciesStore)
  readonly facadeCurrenciesStore: FacadeCurrenciesStore;

  componentWillMount() {
    this.store.loadTransactions();

    if (this.accountStore.isPartner) {
      this.store.getReferralTransactions();
      this.store.getPartnerTotalAmount();
    }


  }

  scrollBottomListener = (e) => {
    const isDown = e.deltaY > 0;
    if (isDown && (window.innerHeight + window.pageYOffset >= document.body.offsetHeight)) {
      // this.store.loadTransactions();
    }
  };

  componentDidMount() {
    // window.addEventListener('wheel', this.scrollBottomListener);
  }

  componentWillUnmount() {
    // window.removeEventListener('wheel', this.scrollBottomListener);
  }

  accordionClickHandler = (id: number) => {
    let currentId = id;
    if (this.state.activeTab === id) {
      currentId = 0;
    }
    this.setState({activeTab: currentId});
  };

  onSort = (sortKey: TransactionSortBy) => {
    this.store.onSort(sortKey);
  };

  tabSwitchHandle = () => {
    this.store.switchTab();
  };

  render() {
    const {
      sortedTransactions,
      sortBy,
      sortDirection,
      typeFilter,
      currentTab,
    } = this.store; // Don't delete sortBy & sortDirection

    const { isPartner } = this.accountStore;

    return (
      <React.Fragment>
        <div className='tabs-switcher row' hidden={!isPartner}>
          <Button
            name='transparent'
            className={classNames({ 'active': currentTab === Tabs.Transactions })}
            onClick={this.tabSwitchHandle}
          >
            <FormattedMessage id='dashboard.transactions.tabs.transactions' defaultMessage='Transactions' />
          </Button>
          <Button
            name='transparent'
            className={classNames({ 'active': currentTab === Tabs.Referral })}
            onClick={this.tabSwitchHandle}
          >
            <FormattedMessage id='dashboard.transactions.tabs.referrals' defaultMessage='Referral' />
          </Button>
        </div>
        {currentTab === Tabs.Transactions  ?
          <React.Fragment>
            <TransactionFilters />
            <div className='transactions__table'>
              <div className='row transactions__table_head'>
                <div className='col-3 d-none d-sm-flex align-items-center'
                     onClick={() => this.onSort(TransactionSortBy.date)}
                >
                  <FormattedMessage id='dashboard.transactions.date' defaultMessage='Date' />
                  {sortBy === TransactionSortBy.date &&
                  <DropdownIcon right='5px' rotated={sortDirection === TransactionSortDirection.ASC}/>
                  }
                </div>
                <div className='col-4 col-sm-3 d-flex align-items-center'
                     onClick={() => this.onSort(TransactionSortBy.type)}
                >
                  <FormattedMessage id='dashboard.transactions.type' defaultMessage='Type' />
                  {sortBy === TransactionSortBy.type &&
                  <DropdownIcon right='5px' rotated={sortDirection === TransactionSortDirection.ASC}/>
                  }
                </div>
                <div className='col-2 d-none d-md-flex align-items-center'
                     onClick={() => this.onSort(TransactionSortBy.amount)}
                >
                  <FormattedMessage id='dashboard.transactions.amount' defaultMessage='Amount' />
                  {sortBy === TransactionSortBy.amount &&
                  <DropdownIcon right='5px' rotated={sortDirection === TransactionSortDirection.ASC}/>
                  }
                </div>
                <div className='col-4 col-sm-3 col-md-2 d-flex align-items-center'
                     onClick={() => this.onSort(TransactionSortBy.currency)}
                >
                  <FormattedMessage id='dashboard.transactions.currency' defaultMessage='Currency' />
                  {sortBy === TransactionSortBy.currency &&
                  <DropdownIcon right='5px' rotated={sortDirection === TransactionSortDirection.ASC}/>
                  }
                </div>
                <div className='col-4 col-sm-3 col-md-2 d-flex align-items-center'
                     onClick={() => this.onSort(TransactionSortBy.status)}
                >
                  <FormattedMessage id='dashboard.transactions.status' defaultMessage='Status' />
                  {sortBy === TransactionSortBy.status &&
                  <DropdownIcon right='5px' rotated={sortDirection === TransactionSortDirection.ASC}/>
                  }
                </div>
              </div>
              {sortedTransactions.length > 0 ?
                sortedTransactions.map((transaction) =>
                  <Transaction
                    onClick={(id) => this.accordionClickHandler(id)}
                    key={transaction.id}
                    isOpen={this.state.activeTab === transaction.id}
                    transaction={transaction}
                    amountToString={this.facadeCurrenciesStore.amountToString.bind(this.facadeCurrenciesStore)}
                   />,
                )
                :
                <div className='text--center'>
                  <p className='p-3'>
                    <FormattedMessage
                  id='dashboard.transactions.haveNoTransactions'
                  defaultMessage='You have no transactions yet'
                />
                  </p>
                </div>
              }
            </div>
          </React.Fragment>
          :
          <Referral />
        }
      </React.Fragment>
    );
  }
}

export default injectIntl(TransactionsContainer);