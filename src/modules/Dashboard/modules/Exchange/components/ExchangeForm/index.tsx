import * as React from 'react';
import './styles.scss';
import classNames from 'classnames';
import Button from '../../../../../Shared/components/Buttons/Button';
import ExchangeIcon from './ExchangeIcon';
import { lazyInject } from '../../../../../IoC';
import { ExchangeStore } from '../../store/ExchangeStore';
import { observer } from 'mobx-react';
import { InputCurrency } from '../../../../../Shared/components/Inputs/InputCurrency';
import { ExchangeFields } from '../../const/ExchangeFields';
import { FacadeCurrenciesStore } from '../../../../../Shared/modules/Currencies/store/FacadeCurrenciesStore';
import { CurrencyType } from '../../../../../Shared/modules/Currencies/const/CurrencyType';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { LocaleStore } from '../../../../../Shared/stores/LocaleStore';
import { observable } from 'mobx';

@observer
class ExchangeForm extends React.Component<InjectedIntlProps>  {
  @lazyInject(ExchangeStore)
  readonly exchangeStore: ExchangeStore;

  @lazyInject(FacadeCurrenciesStore)
  readonly facadeCurrenciesStore: FacadeCurrenciesStore;

  @lazyInject(LocaleStore)
  readonly localeStore: LocaleStore;

  @observable toAmountRaw: string = '0';
  @observable fromAmountRaw: string = '0';

  constructor(props) {
    super(props);
  }

  leftInputProps =  {
    name: 'from',
    label: this.props.intl.formatMessage({
      id: 'dashboard.transactions.from',
      defaultMessage: 'From',
    }),
  };

  rightInputProps = {
    name: 'to',
    label: this.props.intl.formatMessage({
      id: 'dashboard.transactions.to',
      defaultMessage: 'To',
    }),
  };

  timeout;
  handleChange = ({ name, amount, currency }) => {
    clearTimeout(this.timeout);
    const nameToFieldEnum = {
      'from': ExchangeFields.From,
      'to': ExchangeFields.To,
    };

    this.exchangeStore.onChange(nameToFieldEnum[name], amount, currency);

    this.fromAmountRaw = this.exchangeStore.fromAmountRaw;
    this.toAmountRaw = this.exchangeStore.toAmountRaw;
  };

  swapInputs = () => {
    [this.leftInputProps, this.rightInputProps] = [this.rightInputProps, this.leftInputProps];
    [this.fromAmountRaw, this.toAmountRaw] = [this.toAmountRaw, this.fromAmountRaw];
    this.exchangeStore.swap();
  };

  componentWillMount() {
    this.exchangeStore.toAmountRaw = '0';
    this.exchangeStore.fromAmountRaw = '0';
    this.exchangeStore.toError = '';
    this.exchangeStore.fromError = '';
    this.toAmountRaw = this.exchangeStore.toAmountRaw;
    this.fromAmountRaw = this.exchangeStore.fromAmountRaw;

    if (this.exchangeStore.isSwapped) {
      this.exchangeStore.swap();
    }
  }

  render() {
    const { locale } = this.localeStore;
    const { intl } = this.props;

    const { fiatCurrencies, cryptoCurrencies } = this.facadeCurrenciesStore;
    const isSellCrypto = this.exchangeStore.fromCurrencyType === CurrencyType.Crypto;

    const leftInputValue = isSellCrypto ? this.toAmountRaw : this.fromAmountRaw;
    const rightInputValue = isSellCrypto ? this.fromAmountRaw : this.toAmountRaw;

    const leftInputError = isSellCrypto ? this.exchangeStore.toError : this.exchangeStore.fromError;
    const rightInputError = isSellCrypto ? this.exchangeStore.fromError : this.exchangeStore.toError;

    const exchangePrice = this.exchangeStore.exchangePriceString;

    return (
      <div className='row'>
        <div className={classNames('col-12 col-md-5', { 'order-3': isSellCrypto })}>
          {isSellCrypto ?
            <div className='exchange__price'>
              1 {this.exchangeStore.cryptoCurrency} = {exchangePrice} EUR
            </div>
            : null
          }
          <InputCurrency
            name={this.leftInputProps.name}
            label={ !isSellCrypto ?
              this.props.intl.formatMessage({
              id: 'dashboard.transactions.from',
              defaultMessage: 'From',
            }) : this.props.intl.formatMessage({
                id: 'dashboard.transactions.to',
                defaultMessage: 'To',
              })
            }
            onChange={this.handleChange}
            value={leftInputValue}
            currencies={fiatCurrencies}
            showError={!!leftInputError}
            errorMessage={leftInputError && intl.formatMessage({
              id: leftInputError,
              defaultMessage: 'Incorrect input',
            },{MinAmount: this.exchangeStore.minAmount.toString(),
              Currency: this.exchangeStore.isSwapped ? this.exchangeStore.toCurrency : this.exchangeStore.fromCurrency})}
          />
        </div>
        <div className={classNames('col-12 col-md-2 mt-md-2 d-flex justify-content-center align-items-center',
          { 'order-2': isSellCrypto })}
        >
          <Button name='white' className='roll_button' onClick={this.swapInputs}>
            <ExchangeIcon className='roll_button__icon' />
          </Button>
        </div>

        <div className={classNames('col-12 col-md-5', { 'order-1': isSellCrypto })}>
          {!isSellCrypto ?
            <div className='exchange__price'>
              1 {this.exchangeStore.cryptoCurrency} = {exchangePrice} EUR
            </div>
            : null
          }

          <InputCurrency
            name={this.rightInputProps.name}
            label={ isSellCrypto ?
              this.props.intl.formatMessage({
                id: 'dashboard.transactions.from',
                defaultMessage: 'From',
              }) : this.props.intl.formatMessage({
                id: 'dashboard.transactions.to',
                defaultMessage: 'To',
              })
            }
            onChange={this.handleChange}
            value={rightInputValue}
            currencies={cryptoCurrencies}
            showError={!!rightInputError}
            errorMessage={rightInputError && intl.formatMessage({
              id: rightInputError,
              defaultMessage: 'Incorrect input',
            },{MinAmount: this.exchangeStore.minAmount.toString(),
              Currency: this.exchangeStore.isSwapped ? this.exchangeStore.fromCurrency : this.exchangeStore.toCurrency})}/>
        </div>
      </div>
    );
  }
}

export default injectIntl(ExchangeForm);
