import * as React from 'react';
import './style.scss';
import cn from 'classnames';
import Button from '../../../../../Shared/components/Buttons/Button';
import { observer } from 'mobx-react';
import { lazyInject } from '../../../../../IoC';
import { TransactionsStore, TypeFilters } from '../../stores/TransactionsStore';
import Input from '../../../../../Shared/components/Inputs/Input';
import Select from '../../../../../Shared/components/Inputs/Select';
import InputDate from '../../../../../Shared/components/Inputs/InputDate';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import { LocaleStore } from '../../../../../Shared/stores/LocaleStore';

interface IState {
  sumFilterMin?: number;
  sumFilterMax?: number;
  currencyFilter?: string;
  dateFilterMin?: Date;
  dateFilterMax?: Date;
  dateFilterMinError: boolean;
  dateFilterMaxError: boolean;
}

@observer
class TransactionFilters extends React.Component<InjectedIntlProps, IState> {
  state: IState = { dateFilterMinError: false, dateFilterMaxError: false, currencyFilter: ''};

  @lazyInject(TransactionsStore)
  store: TransactionsStore;

  @lazyInject(LocaleStore)
  localeStore: LocaleStore;


  createTypeFilterChangeHandler = filter => () => {
    this.store.typeFilter = filter;
  };

  handleFilterChange = ({ name, value }) => {
    this.setState({ [name]: value } as any);
  };

  handleDateFilterChange = ({ name, value, raw }) => {
    if (!raw) {
      this.setState({ [name]: undefined, [name + 'Error']: false } as any);
      return;
    }

    if (isNaN(value.getTime())) {
      this.setState({ [name]: undefined, [name + 'Error']: true } as any);
    } else {
      this.setState({ [name]: value, [name + 'Error']: false } as any);
    }
  };

  onSearchClick = () => {
    const { currencyFilter, dateFilterMax, dateFilterMin, sumFilterMax, sumFilterMin } = this.state;
    this.store.currencyFilter = currencyFilter;
    this.store.dateFilterMin = dateFilterMin;
    this.store.dateFilterMax = dateFilterMax;
    this.store.sumFilterMin = sumFilterMin;
    this.store.sumFilterMax = sumFilterMax;
  };

  render() {
    const { typeFilter } = this.store;
    const { intl } = this.props;
    const { locale } = this.localeStore;

    const filters = [TypeFilters.ALL, TypeFilters.DEPOSIT, TypeFilters.WITHDRAW, TypeFilters.EXCHANGE];
    const filtersTexts = {
      [TypeFilters.ALL]: intl.formatMessage({
        id: 'dashboard.transactions.filters.all', defaultMessage: 'All',
      }),

      [TypeFilters.DEPOSIT]: intl.formatMessage({
        id: 'dashboard.transactions.filters.deposit', defaultMessage: 'Deposit',
      }),

      [TypeFilters.WITHDRAW]: intl.formatMessage({
        id: 'dashboard.transactions.filters.withdraw', defaultMessage: 'Withdraw',
      }),

      [TypeFilters.EXCHANGE]: intl.formatMessage({
        id: 'dashboard.transactions.filters.exchange', defaultMessage: 'Exchange',
      }),
    };

    return (
      <div className='transaction-filters row'>
        <div className='type-filters row mb-4'>
          {filters.map((filter, index) => (
            <Button name='transparent'
                    key={index}
                    className={cn({ 'active': typeFilter === filter })}
                    onClick={this.createTypeFilterChangeHandler(filter)}
            >
              {filtersTexts[filter]}
            </Button>
          ))}
        </div>
        <div className='row align-items-center'>
          <div className='col-sm-12 col-lg-4 pair-filters'>
            <Input
              name='sumFilterMin'
              label={intl.formatMessage({
                id: 'dashboard.transactions.amountFrom',
                defaultMessage: 'Amount From',
              })}
              mask='999999999'
              maskChar={null}
              onChange={this.handleFilterChange}
            />
            <Input
              name='sumFilterMax'
              label={intl.formatMessage({
                id: 'dashboard.transactions.amountUnder',
                defaultMessage: 'Amount Under',
              })}
              mask='999999999'
              maskChar={null}
              onChange={this.handleFilterChange}
            />
          </div>
          <div className='col-sm-12 col-lg-2 currency-filters'>
            <Select
              name='currencyFilter'
              label={intl.formatMessage({
                id: 'dashboard.transactions.currency',
                defaultMessage: 'Currency',
              })}
              value={this.state.currencyFilter}
              options={[
                { label: 'All', value: '' },
                { label: 'BTC', value: 'BTC'},
                { label: 'EUR', value: 'EUR'},
              ]}
              onChange={this.handleFilterChange}
            />
          </div>
          <div className='col-sm-12 col-lg-4 pair-filters'>
            <InputDate
              name='dateFilterMin'
              label={intl.formatMessage({
                id: 'dashboard.transactions.dateFrom',
                defaultMessage: 'Date From',
              })}
              placeholder={intl.formatMessage({
                id: 'dashboard.datePlaceholder',
                defaultMessage: 'DD.MM.YYYY',
              })}
              onChange={this.handleDateFilterChange}
              showError={this.state.dateFilterMinError}
              mask='**.**.****'
              maskChar={null}
            />
            <InputDate
              name='dateFilterMax'
              label={intl.formatMessage({
                id: 'dashboard.transactions.dateBefore',
                defaultMessage: 'Date Before',
              })}
              placeholder={intl.formatMessage({
                id: 'dashboard.datePlaceholder',
                defaultMessage: 'DD.MM.YYYY',
              })}
              onChange={this.handleDateFilterChange}
              showError={this.state.dateFilterMaxError}
              mask='**.**.****'
              maskChar={null}
            />
          </div>
          <div className='col-12 col-lg-2 text--center'>
            <Button name='sell' className='search-btn' onClick={this.onSearchClick}>
                <FormattedMessage id='dashboard.transactions.search' defaultMessage='Search' />
            </Button>
          </div>

        </div>
      </div>
    );
  }
}

export default injectIntl(TransactionFilters);
