import * as React from 'react';
import Modal from '../../../../../Modals/components/ModalBase';
import Input from '../../../../../Shared/components/Inputs/Input';
import Button from '../../../../../Shared/components/Buttons/Button';
import Select from '../../../../../Shared/components/Inputs/Select';
import { lazyInject } from '../../../../../IoC';
import { BankAccountsStore } from '../../../Profile/stores/BankAccountsStore';
import { WalletWithdrawFiatStore } from '../../store/fiat/WalletWithdrawFiatStore';
import { AccountStore } from '../../../Profile/stores/AccountStore';
import { observer } from 'mobx-react';
import { TransactionDepositMethodType } from '../../../../../Shared/modules/Transactions/const/TransactionDepositMethodType';
import { RouteComponentProps, withRouter } from 'react-router';
import { InputWithdrawal } from '../../../../../Shared/components/Inputs/InputWithdrawal';
import { WalletStore } from '../../store/WalletStore';
import BigNumber from 'bignumber.js';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { ModalStore } from '../../../../../Modals/store/ModalStore';

interface IProps {
  currency: string;
  onClose: () => void;
}

@observer
class WithdrawFiat extends React.Component<IProps & RouteComponentProps<any> & InjectedIntlProps> {
  @lazyInject(BankAccountsStore)
  private readonly bankAccountStore: BankAccountsStore;

  @lazyInject(WalletWithdrawFiatStore)
  store: WalletWithdrawFiatStore;

  @lazyInject(AccountStore)
  private readonly accountStore: AccountStore;

  @lazyInject(WalletStore)
  private readonly walletStore: WalletStore;

  @lazyInject(ModalStore)
  modalStore: ModalStore;

  timeout;
  handleAmountChange = ({ amount }) => {
    clearTimeout(this.timeout);
    this.store.receiveAmountChange(amount);

    setTimeout(() => this.store.calcFee(), 600);
  };

  handleBankAccountChange = ({ value }) =>
    this.store.receiveMethodChange(TransactionDepositMethodType.BankAccount, value.id);

  handleTwoFAChange = ({ value }) => this.store.twoFACodeChange(value);

  handleSubmit = e => {
    e.preventDefault();

    if (this.store.validate()) {
      this.store.createTransaction().then(transactionReferenceId => {
        if (!transactionReferenceId) {
          return;
        }

        this.props.onClose();
        this.props.history.push('/dashboard/transactions/' + transactionReferenceId);
      });
    }
  };

  componentWillMount() {
    this.store.reset();
  }

  handleAdd = () => {
    this.modalStore.openModal('ADD_BANK');
  };

  render() {
    const balance = this.walletStore.fiatBalances.get('EUR').isEqualTo(new BigNumber(0))
                    ? new BigNumber(0).toString()
                    : this.walletStore.fiatBalances.get('EUR').toFixed(2);
    const { intl } = this.props;

    // TODO: delete this shit
    const isEmpty = Array.from(this.bankAccountStore.bankAccounts.values()).length < 1;

    const arr = [...Array.from(this.bankAccountStore.bankAccounts.values()).map(bank => ({
        label: `${bank.label} - ...${bank.IBAN.slice(-4)}`,
        value: bank,
      })),
    ];

    const addArr = [{label: 'Add new bank account', value: this.handleAdd}];

    return (
      <Modal onRequestClose={this.props.onClose} className='wallet-modal'>
        <Modal.Title>
          <FormattedMessage id='dashboard.exchange.withdraw' defaultMessage='Withdraw' /> {this.props.currency}
        </Modal.Title>
        <form onSubmit={this.handleSubmit}>
          <InputWithdrawal
            name='amount'
            label={intl.formatMessage({
              id: 'dashboard.exchange.amount',
              defaultMessage: 'Amount',
            })}
            placeholder={intl.formatMessage({
              id: 'dashboard.withdrawCrypto.amountPlaceholder',
              defaultMessage: 'Enter amount of withdraw',
            })}
            balance={balance}
            value={this.store.paymentAmountRaw}
            onChange={this.handleAmountChange}
            showError={!!this.store.receiveInputError}
            errorMessage={this.store.receiveInputError && intl.formatMessage({
              id: this.store.receiveInputError,
              defaultMessage: 'Field is required',
            })}
          />

          <Select
            name='bankAccount'
            label={intl.formatMessage({
              id: 'dashboard.withdrawFiat.bankAccountLabel',
              defaultMessage: 'Bank account',
            })}
            placeholder={intl.formatMessage({
              id: 'dashboard.withdrawFiat.bankAccountPlaceholder',
              defaultMessage: 'Select account',
            })}
            options={isEmpty ? addArr : arr}
            onChange={this.handleBankAccountChange}
            showError={!!this.store.receiveMethodError}
            errorMessage={this.store.receiveMethodError && intl.formatMessage({
              id: this.store.receiveMethodError,
              defaultMessage: 'Field is required',
            })}
            forceDropdown
          />

          {this.accountStore.twoFaEnabled &&
            <Input
              name='code'
              label={intl.formatMessage({
                id: 'dashboard.withdrawCrypto.2FACodeLabel',
                defaultMessage: '2FA Code',
              })}
              placeholder={intl.formatMessage({
                id: 'dashboard.withdrawCrypto.2FACodePlaceholder',
                defaultMessage: 'Enter 2FA code',
              })}
              value={this.store.twoFaCode}
              onChange={this.handleTwoFAChange}
              showError={!!this.store.twoFACodeError}
              errorMessage={intl.formatMessage({
                id: 'authorization.2fa.incorrect',
                defaultMessage: 'Incorrect 2FA code',
              })}
            />
          }

          <div className='row'>
            <label className='form__label col-6'>
              <FormattedMessage id='dashboard.exchange.fee' defaultMessage='Fee' />:
            </label>
            <label className='form__label col-6 text-right'>{this.store.feeAmountString}</label>
          </div>
          <div className='row'>
            <label className='form__label col-6'>
              <FormattedMessage id='dashboard.exchange.receive' defaultMessage='Receive' />:
            </label>
            <label className='form__label col-6 text-right'>{this.store.receiveAmount}</label>
          </div>

          <Button name='modal' type='submit'>
            <FormattedMessage id='dashboard.confirm' defaultMessage='Confirm' />
          </Button>
        </form>
      </Modal>
    );
  }
}

export default injectIntl(withRouter(WithdrawFiat));
