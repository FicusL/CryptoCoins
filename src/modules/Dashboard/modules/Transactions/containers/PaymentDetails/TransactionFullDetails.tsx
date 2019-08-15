import * as React from 'react';

import { observer } from 'mobx-react';
import { lazyInject } from '../../../../../IoC';
import { TransactionsStore } from '../../stores/TransactionsStore';
import { ModalStore } from '../../../../../Modals/store/ModalStore';
import { TransactionModel } from '../../../../../Shared/modules/Transactions/model/TransactionModel';
import { RouteComponentProps, withRouter } from 'react-router';
import { TransactionType } from '../../../../../Shared/modules/Transactions/const/TransactionType';
import { AccountStore } from '../../../Profile/stores/AccountStore';
import { AdvancedCashPaymentStore } from '../../../PaymentMethods/stores/AdvancedCashPaymentStore';
import { PayeerPaymentStore } from '../../../PaymentMethods/stores/PayeerPaymentStore';
import TransactionProgress from '../../components/TransactionProgress/TransactionProgress';
import './style.scss';
import { BankAccountsStore } from '../../../Profile/stores/BankAccountsStore';
import { CryptoWalletsStore } from '../../../Profile/stores/CryptoWalletsStore';
import { TransactionDepositMethodType } from '../../../../../Shared/modules/Transactions/const/TransactionDepositMethodType';
import { IPaymentStore } from '../../../PaymentMethods/stores/abstract/IPaymentStore';
import Button from '../../../../../Shared/components/Buttons/Button';
import ZichangeRequisites from './ZichangeRequisites';
import { FacadeCurrenciesStore } from '../../../../../Shared/modules/Currencies/store/FacadeCurrenciesStore';
import DepositMethod from './DepositMethod';
import WithdrawalMethod from './WithdrawalMethod';
import { TransactionWithdrawalMethodType } from '../../../../../Shared/modules/Transactions/const/TransactionWithdrawalMethodType';
import { Link } from 'react-router-dom';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';

interface IState {
  referenceId: string;
  currentTransaction?: TransactionModel;
  loading: boolean;
  currentWithdrawalId?: number;
  withdrawalId?: number;

  twoFACode: string;
  twoFACodeError: string;
}

interface IProps extends RouteComponentProps<null> {
  referenceId: string;
}

// TODO: Simplify by separating to components

@observer
class TransactionDetails extends React.Component<IProps & InjectedIntlProps, IState> {
  @lazyInject(ModalStore)
  readonly modalStore: ModalStore;

  @lazyInject(AccountStore)
  readonly accountStore: AccountStore;

  @lazyInject(TransactionsStore)
  readonly transactionStore: TransactionsStore;

  @lazyInject(BankAccountsStore)
  readonly bankAccountsStore: BankAccountsStore;

  @lazyInject(CryptoWalletsStore)
  readonly cryptoWalletsStore: CryptoWalletsStore;

  @lazyInject(FacadeCurrenciesStore)
  readonly facadeCurrenciesStore: FacadeCurrenciesStore;

  @lazyInject(AdvancedCashPaymentStore)
  readonly advancedCashPaymentStore: AdvancedCashPaymentStore;

  @lazyInject(PayeerPaymentStore)
  readonly payeerPaymentStore: PayeerPaymentStore;


  constructor(props) {
    super(props);

    this.state = {
      referenceId: this.props.referenceId,
      loading: true,

      twoFACode: '',
      twoFACodeError: '',
    };
  }

  componentWillMount() {
    this.updateTransaction();
  }

  updateTransaction() {
    this.transactionStore.getTransactionByReferenceId(this.props.referenceId).then(transaction => {
      if (transaction) {
        let withdrawalId = -1;

        if (transaction.withdrawal) {
          const method = transaction.withdrawal.method;
          if (method.type === TransactionWithdrawalMethodType.BankAccount) {
            const bankAccounts = Array.from(this.bankAccountsStore.bankAccounts.values());

            const bankAccount = bankAccounts.find(item =>
                item.bankName === method.data.bankName &&
                item.recipientName === method.data.recipientName &&
                item.currency === method.data.currency &&
                item.IBAN === method.data.IBAN &&
                item.BIC === method.data.BIC,
            );

            if (bankAccount && bankAccount.id) {
              withdrawalId = bankAccount.id;
            } else {
              withdrawalId =  -1;
            }
          }

          if (method.type === TransactionWithdrawalMethodType.CryptoWallet) {
            const cryptoWallets = Array.from(this.cryptoWalletsStore.wallets.values());
            const cryptoWallet = cryptoWallets.find((item) => item.address === method.data.address);

            if (cryptoWallet && cryptoWallet.id) {
              withdrawalId = cryptoWallet.id;
            } else {
              withdrawalId = -1;
            }
          }
        }

        this.setState({
            currentTransaction: transaction,
            currentWithdrawalId: withdrawalId,
            loading: false,
            withdrawalId,
        });

      } else {
        this.modalStore.openModal(
          'ERROR',
          {description: 'You don\'t have transaction with this reference ID'},
        );

        this.props.history.push('/dashboard/transactions');
      }
    });
  }

  handlePayButtonClick = () => {
    const transaction = this.state.currentTransaction as TransactionModel;
    if (!transaction) {
      return;
    }

    if (!transaction.deposit) {
      return;
    }

    const paymentMethodTypeToStore = {
      [TransactionDepositMethodType.AdvancedCash]: this.advancedCashPaymentStore,
      [TransactionDepositMethodType.Payeer]: this.payeerPaymentStore,
    };

    const store = paymentMethodTypeToStore[transaction.deposit.method.type] as IPaymentStore;
    if (!store) {
      return;
    }

    store.payRequest(transaction);
  };

  render() {
    if (this.state.loading) {
      return null;
    }

    const transaction = this.state.currentTransaction as TransactionModel;

    const {
      fromAmount,
      fromCurrency,
      depositFeeString,
      exchangeFeeString,
      withdrawalFeeString,
      toAmount,
      toCurrency,
      referenceId,
    } = transaction;

    const { email } = this.accountStore;

    let showAdvancedCashPayButton = false;
    let showPayeerPayButton = false;

    if (transaction.deposit && !transaction.deposit.paid) {
      showAdvancedCashPayButton = transaction.deposit.method.type === TransactionDepositMethodType.AdvancedCash;
      showPayeerPayButton = transaction.deposit.method.type === TransactionDepositMethodType.Payeer;
    }

    const { intl } = this.props;

    return (
      <div className='payment-details'>
        <TransactionProgress transaction={transaction}/>
        {transaction.deposit && transaction.deposit.method.type === TransactionDepositMethodType.BankAccount &&
          <ZichangeRequisites referenceId={referenceId} deposit={transaction.deposit} />
        }
        {transaction.deposit && transaction.deposit.method.type === TransactionDepositMethodType.BankAccount &&
        <React.Fragment>
          <div className='warning warning__container mb-4'>
            <div className='warning__block'>
              <span className='warning__sign'>!</span> &nbsp;
              <FormattedMessage id='dashboard.transactions.warning.title' defaultMessage='warning' />
            </div>

            <p className='warning__description'>
              <FormattedMessage
                id='dashboard.transactions.warning.descriptionPart1'
                defaultMessage='Make sure to add your Transfer reference ID as comment to wire transfer.'
              />
              <br/>
              <FormattedMessage
                id='dashboard.transactions.warning.descriptionPart2'
                defaultMessage='Transactions without reference ID will be lost!'
              />
            </p>
          </div>
        </React.Fragment>
        }
        <div className='payment-details__table'>
          <div className='row align-items-center justify-content-between table__row'>
            <div className='col-6'>
              <FormattedMessage id='dashboard.transactions.from' defaultMessage='From' />:
            </div>
            <div className='col-6 text-right'>
              {`${this.facadeCurrenciesStore.amountToString(fromAmount, fromCurrency)} ${fromCurrency}`}
            </div>
          </div>

          {exchangeFeeString &&
            <div className='row align-items-center justify-content-between table__row'>
              <div className='col-6'>
                {intl.formatMessage({
                  id: 'dashboard.transactions.exchangeFee',
                  defaultMessage: 'Exchange fee:',
                })}
              </div>
              <div className='col-6  text-right'>{exchangeFeeString}</div>
            </div>
          }

          {depositFeeString &&
            <div className='row align-items-center justify-content-between table__row'>
              <div className='col-6'>
                {intl.formatMessage({
                  id: 'dashboard.transactions.depositFee',
                  defaultMessage: 'Deposit fee:',
                })}
              </div>
              <div className='col-6  text-right'>{depositFeeString}</div>
            </div>
          }

          {withdrawalFeeString &&
            <div className='row align-items-center justify-content-between table__row'>
              <div className='col-6'>
                {intl.formatMessage({
                  id: 'dashboard.transactions.withdrawalFee',
                  defaultMessage: 'Withdrawal fee:',
                })}
                </div>
              <div className='col-6  text-right'>{withdrawalFeeString}</div>
            </div>
          }

          <div className='row align-items-center justify-content-between table__row'>
            <div className='col-6'>
              <FormattedMessage id='dashboard.transactions.to' defaultMessage='To' />:
            </div>
            <div className='col-6  text-right'>
              {`${this.facadeCurrenciesStore.amountToString(toAmount, toCurrency)} ${toCurrency}`}&nbsp;
              ({intl.formatMessage({
                id: 'dashboard.exchangeConfirmation.estimatedAmount',
                defaultMessage: 'estimated amount',
              })})
            </div>
          </div>

          {transaction.deposit &&
            <div className='row align-items-center justify-content-between table__row'>
              <div className='col-6 text-md-left'>
                <FormattedMessage id='dashboard.transactions.payFrom' defaultMessage='Pay from' />:
              </div>
              <div className='col-6 text-right'>
                <DepositMethod depositMethodType={transaction.deposit.method.type}
                               currency={transaction.deposit.currency} email={email}/>
              </div>
            </div>
          }

          {transaction.withdrawal &&
            <div className='row align-items-center justify-content-between table__row'>
              <div className='col-12 text-center col-md-4 text-md-left'>
                {transaction.withdrawal.currency}
                &nbsp;
                {intl.formatMessage({
                  id: 'dashboard.transactions.willBeSentTo',
                  defaultMessage: 'will be sent to: ',
                })}
              </div>
              <div className='col-12 text-center col-md-8 text-md-right'>
                <WithdrawalMethod withdrawalMethod={transaction.withdrawal.method}
                                  currency={transaction.withdrawal.currency}/>
              </div>
            </div>
          }
        </div>

        <div className='container col-12 text--center'>
          {transaction.type !== TransactionType.ExchangeWithdrawal &&
          <React.Fragment>
            <Link to='/dashboard/transactions'>
              <Button name='white' className='payment-details__buttons col mb-3 mb-lg-0 mr-lg-5'>
                <FormattedMessage
                  id='dashboard.transactions.returnToTransactions'
                  defaultMessage='Return to Transactions'
                />
              </Button>
            </Link>
          </React.Fragment>
          }

          {showAdvancedCashPayButton &&
            <Button name='white'
                    className='payment-details__buttons col'
                    onClick={this.handlePayButtonClick}>
              <FormattedMessage
                id='dashboard.transactions.payWithAdvancedCash'
                defaultMessage='Pay with Advanced Cash'
              />
            </Button>
          }

          {showPayeerPayButton &&
            <Button name='white'
                    className='payment-details__buttons col'
                    onClick={this.handlePayButtonClick}>
              <FormattedMessage
                id='dashboard.transactions.payWithPayeer'
                defaultMessage='Pay with PAYEER'
              />
            </Button>
          }
        </div>
      </div>
    );
  }
}

export default injectIntl(withRouter(TransactionDetails));