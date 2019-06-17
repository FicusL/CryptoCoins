import * as React from 'react';
import './style.scss';
import Button from '../../../../Shared/components/Buttons/Button';
import { lazyInject } from '../../../../IoC';
import { observer } from 'mobx-react';
import { ExchangeStore } from '../store/ExchangeStore';
import { BankAccountsStore } from '../../Profile/stores/BankAccountsStore';
import { CryptoWalletsStore } from '../../Profile/stores/CryptoWalletsStore';
import { RouteComponentProps } from 'react-router';
import { WalletStore } from '../store/WalletStore';
import { AccountStore } from '../../Profile/stores/AccountStore';
import { ModalStore } from '../../../../Modals/store/ModalStore';
import { Link } from 'react-router-dom';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { CurrencyType } from '../../../../Shared/modules/Currencies/const/CurrencyType';
import RadioButton from '../../../../Shared/components/Inputs/RadioButton/RadioButton';
import { IBankAccount } from '../../Profile/interfaces/IBankAccount';
import { TransactionWithdrawalMethodType } from '../../../../Shared/modules/Transactions/const/TransactionWithdrawalMethodType';
import { ICryptoWallet } from '../../Profile/interfaces/ICryptoWallet';
import { AxiosResponse } from 'axios';
import { AccountExceptionsCodes } from '../../../../Shared/const/exceptions/AccountExceptionCodes';

interface IState {
  currentWithdrawalId?: number;
  withdrawalId?: number;

  twoFACode: string;
  twoFACodeError: string;
}

@observer
class ExchangeConfirmationContainer extends React.Component<RouteComponentProps<null> & InjectedIntlProps, IState> {
  @lazyInject(ExchangeStore)
  readonly exchangeStore: ExchangeStore;

  @lazyInject(BankAccountsStore)
  readonly bankAccountsStore: BankAccountsStore;

  @lazyInject(CryptoWalletsStore)
  readonly cryptoWalletsStore: CryptoWalletsStore;

  @lazyInject(WalletStore)
  readonly zichangeWallet: WalletStore;

  @lazyInject(AccountStore)
  readonly accountStore: AccountStore;

  @lazyInject(ModalStore)
  readonly modalStore: ModalStore;

  constructor(props) {
    super(props);

    this.state = {
      currentWithdrawalId: -1,

      twoFACode: '',
      twoFACodeError: '',
    };
  }

  componentWillMount() {
    const { state } = this.props.location;

    if (state && state.fromExchange) {
      // Clear session storage
      this.props.history.replace({ ...this.props.location, state: undefined });
    } else {
      this.props.history.replace('/dashboard');
    }
  }

  WithdrawalOption = ({ value, name, symbol, content, checked, onChange }) => (
    <div className='withdrawal__details-value row'>
      <RadioButton value={value} name={name} checked={checked} onChange={onChange} />
      <h4>
        <span className='pr-3'>{symbol}</span> {content}
      </h4>
    </div>
  );

  WithdrawalFiatChange = () => {
    const { WithdrawalOption } = this;

    const bankAccountsArray = Array.from(this.bankAccountsStore.bankAccounts.values());

    const optionsArray = [ { id: -1, label: 'Zichange wallet' } as IBankAccount, ...bankAccountsArray ];

    const { currentWithdrawalId } = this.state;

    return (
      <React.Fragment>
        {optionsArray.map((option: IBankAccount, i) => {
          const isChecked = (currentWithdrawalId === option.id);

          return (
            <WithdrawalOption value={option.id} key={i} name={'bank_account'} symbol={'€'} checked={isChecked} content={
              option.id === -1
                ? option.label
                : `${option.bankName} ${option.IBAN} ${option.recipientName}`
            } onChange={({ value }) => this.setState({ currentWithdrawalId: +value })} />
          );
        })}

        <div className='row justify-content-center mt-3 mb-3'>
          <Button name='dark' onClick={() => this.modalStore.openModal('ADD_BANK')}>
            <FormattedMessage id='dashboard.exchangeConfirmation.add' defaultMessage='Add' />
          </Button>
        </div>
      </React.Fragment>
    );
  };

  WithdrawalCryptoChange = () => {
    const { WithdrawalOption } = this;
    const cryptoWalletsArray = Array.from(this.cryptoWalletsStore.wallets.values());

    const optionsArray = [ { id: -1, label: 'Zichange wallet' } as ICryptoWallet, ...cryptoWalletsArray ];

    const { currentWithdrawalId } = this.state;

    return (
      <React.Fragment>
        {optionsArray.map((option: ICryptoWallet, i) => {
          const isChecked = (currentWithdrawalId === option.id);

          return (
            <WithdrawalOption value={option.id} key={i} name={'wallet'} symbol={'₿'} checked={isChecked} content={
              option.label
            } onChange={({ value }) => this.setState({ currentWithdrawalId: +value })} />
          );
        })}

        <div className='row justify-content-center mt-3 mb-3'>
          <Button name='dark' onClick={() => this.modalStore.openModal('ADD_WALLET')}>
            <FormattedMessage id='dashboard.exchangeConfirmation.add' defaultMessage='Add' />
          </Button>
        </div>

      </React.Fragment>
    );
  };

  on2FACodeChange = (code: string) => {
    this.setState({ twoFACode: code });
    this.modalStore.updateModalProps('TRANSACTION_CHANGE_WITHDRAWAL_2FA', { code });
  };

  onPlaceOrder = () => {
    const type = this.exchangeStore.fromCurrencyType === CurrencyType.Crypto
      ? TransactionWithdrawalMethodType.BankAccount
      : TransactionWithdrawalMethodType.CryptoWallet;

    const { twoFACode, currentWithdrawalId } = this.state;

    if (this.state.currentWithdrawalId !== -1) {
      if (!this.state.twoFACode) {
        this.modalStore.closeModal('TRANSACTION_CHANGE_WITHDRAWAL_2FA');
        this.modalStore.openModal('TRANSACTION_CHANGE_WITHDRAWAL_2FA', {
          code: '',
          error: '',
          onCodeChange: this.on2FACodeChange,
          onClose: () => this.modalStore.closeModal('TRANSACTION_CHANGE_WITHDRAWAL_2FA'),
          onSubmit: () => this.onPlaceOrder(),
        });
        return;
      }
    }

    this.exchangeStore.placeOrder(type, twoFACode, currentWithdrawalId)
      .then(transactionReferenceId => {
        this.setState({ twoFACode: '' });
        this.modalStore.closeModal('TRANSACTION_CHANGE_WITHDRAWAL_2FA');

        if (!transactionReferenceId) {
          this.props.history.replace('/dashboard');
          return;
        }

        this.props.history.push('/dashboard/transactions/' + transactionReferenceId);
        this.modalStore.openModal('SUCCESS', {
          title: this.props.intl.formatMessage({
            id: 'dashboard.exchangeConfirmation.orderIsAccepted.title',
            defaultMessage: 'Your order is accepted',
          }),
          description: this.props.intl.formatMessage({
            id: 'dashboard.exchangeConfirmation.orderIsAccepted.description',
          }),
        });
      })
      .catch((response: AxiosResponse) => {
        if (response.data && response.data.message && response.data.message[0]) {
          const message = response.data.message[0];
          if (message.code !== AccountExceptionsCodes.Incorrect2FACode) {
            return;
          }

          this.setState({ twoFACode: '' });
          this.modalStore.updateModalProps('TRANSACTION_CHANGE_WITHDRAWAL_2FA', {
            code: '',
            error: 'Incorrect code',
          });
        }
      });
  };

  render() {
    // TODO: Redirect if not enough info
    const isSellCrypto = this.exchangeStore.fromCurrencyType === CurrencyType.Crypto;
    const { WithdrawalFiatChange, WithdrawalCryptoChange } = this;
    return (
      <div className='exchange-confirmation'>
        <div className='container transaction-details__table'>
          <div className='row align-items-center justify-content-between mb-5'>
            <div className='col-6'>
              <h3 className='header m-0 font-responsive__title'>
                <FormattedMessage id='dashboard.transactions.from' defaultMessage='From' />
              </h3>
            </div>
            <div className='col-6 text-right'>
              {`${this.exchangeStore.fromAmountString} ${this.exchangeStore.fromCurrency}`}
            </div>
          </div>

          <div className='row align-items-center justify-content-between mb-5'>
            <div className='col-8'>
              <h3 className='header m-0 font-responsive__title'>
                <FormattedMessage id='dashboard.transactions.fee' defaultMessage='Fee' />&nbsp;
                ({this.exchangeStore.feePercentString}%)
              </h3>
            </div>
            <div className='col-4 text-right'>
              {`${this.exchangeStore.feeAmountString} ${this.exchangeStore.fromCurrency}`}
            </div>
          </div>

          <div className='row align-items-center justify-content-between mb-5'>
            <div className='col-6'>
              <h3 className='header m-0 font-responsive__title'>
                <FormattedMessage id='dashboard.transactions.to' defaultMessage='To' />
              </h3>
            </div>
            <div className='col-6 text-right transaction-details__table__receiveValue'>
              {this.exchangeStore.toAmountString + ` ` + this.exchangeStore.toCurrency}
              <span>({this.props.intl.formatMessage({
                id: 'dashboard.exchangeConfirmation.estimatedAmount',
                defaultMessage: 'estimated amount',
              })})</span>
            </div>
          </div>
        </div>

        <div className='container'>
          {isSellCrypto &&
          <div>
            <h2 className='header text-center text-lg-left mb-3'>
              <FormattedMessage id='dashboard.exchangeConfirmation.whereToSend' defaultMessage='Where to send?' />
            </h2>
            <WithdrawalFiatChange />
          </div>
          }

          {!isSellCrypto &&
          <div>
            <h2 className='header text-center text-lg-left mb-3'>
              <FormattedMessage id='dashboard.exchangeConfirmation.whereToSend' defaultMessage='Where to send?' />
            </h2>
            <WithdrawalCryptoChange />
          </div>
          }
        </div>

        <div className='col-12  text--center'>
          <p>
            <FormattedMessage
              id='dashboard.exchangeConfirmation.favorableCryptocurrencyPrices'
              defaultMessage='We ensure favorable cryptocurrency prices according to our Best Execution Policy.'
            />
            <br/>
            <FormattedMessage
              id='dashboard.transactions.exchangeRateMightChange'
              defaultMessage='The exchange rate might change under market
              conditions at the moment of actual transaction.'
            />
          </p>
        </div>

        <div className='container col-12 text--center'>
          <Link to='/dashboard'>
            <Button name='white' className='exchange-confirmation__buttons-responsive m-3 col'>
              <FormattedMessage id='dashboard.exchangeConfirmation.cancel' defaultMessage='Cancel' />
            </Button>
          </Link>
          <Button name='white' onClick={this.onPlaceOrder} className='exchange-confirmation__buttons-responsive col'>
            <FormattedMessage id='dashboard.exchangeConfirmation.confirm' defaultMessage='Confirm' />
          </Button>
        </div>
      </div>
    );
  }
}

export default injectIntl(ExchangeConfirmationContainer);