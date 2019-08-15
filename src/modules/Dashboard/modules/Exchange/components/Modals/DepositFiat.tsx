import * as React from 'react';
import Modal from '../../../../../Modals/components/ModalBase';
import Input from '../../../../../Shared/components/Inputs/Input';
import Button from '../../../../../Shared/components/Buttons/Button';
import { lazyInject } from '../../../../../IoC';
import { WalletDepositFiatStore } from '../../store/fiat/WalletDepositFiatStore';
import Select from '../../../../../Shared/components/Inputs/Select';
import { BankAccountsStore } from '../../../Profile/stores/BankAccountsStore';
import { observer } from 'mobx-react';
import { TransactionDepositMethodType } from '../../../../../Shared/modules/Transactions/const/TransactionDepositMethodType';
import { RouteComponentProps, withRouter } from 'react-router';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { ModalStore } from '../../../../../Modals/store/ModalStore';
import { observable } from 'mobx';

interface IProps {
  currency: string;
  onClose: () => void;
}

@observer
class DepositFiat extends React.Component<IProps & RouteComponentProps<any> & InjectedIntlProps> {

  @lazyInject(WalletDepositFiatStore)
  store: WalletDepositFiatStore;

  @lazyInject(BankAccountsStore)
  bankAccountStore: BankAccountsStore;

  @lazyInject(ModalStore)
  modalStore: ModalStore;

  @observable royalPayBankCard: boolean = false;

  timeout;
  handleAmountChange = ({ value }) => {
    clearTimeout(this.timeout);

    this.store.paymentAmountChange(value);

    this.timeout = setTimeout(() => this.store.calculate(), 600);
  };

  handlePaymentMethodChange = ({ value }) =>
    this.store.paymentMethodChange(value.type, value.id);

  handleSubmit = (e) => {
    e.preventDefault();

    if (this.store.validate()) {
      this.royalPayBankCard = TransactionDepositMethodType.RoyalPayBankCard === this.store.paymentMethodType;

      this.store.createTransaction().then(transactionReferenceId => {
        if (!transactionReferenceId) {
          return;
        }

        this.props.onClose();

        if (this.royalPayBankCard) {
          this.modalStore.openModal('COUNTERPARTY_PAYMENT', { referenceId: transactionReferenceId });

        } else {
          this.props.history.push('/dashboard/transactions/' + transactionReferenceId);
        }

      });
    }
  };

  componentWillUnmount() {
    this.store.reset();
  }

  render() {
    const { intl } = this.props;

    return (
      <Modal onRequestClose={this.props.onClose} className='wallet-modal'>
        <Modal.Title>
          <FormattedMessage id='dashboard.exchange.deposit' defaultMessage='Deposit' /> {this.props.currency}
        </Modal.Title>
        <form onSubmit={this.handleSubmit}>
          <Input
              name='amount'
              label={intl.formatMessage({
                id: 'dashboard.exchange.amount',
                defaultMessage: 'Amount',
              })}
              value={this.store.paymentAmountRaw}
              placeholder={intl.formatMessage({
                id: 'dashboard.depositFiat.amountPlaceholder',
                defaultMessage: 'Enter amount of deposit',
              })}
              onChange={this.handleAmountChange}
              showError={!!this.store.paymentInputError}
              errorMessage={this.store.paymentInputError && intl.formatMessage({
                id: this.store.paymentInputError,
                defaultMessage: 'Field is required',
              })}
          />
          <div className='wallet-modal__payment-method'>
            <Select
                label={intl.formatMessage({
                  id: 'dashboard.depositFiat.paymentMethodLabel',
                  defaultMessage: 'Payment method',
                })}
                placeholder={intl.formatMessage({
                  id: 'dashboard.depositFiat.paymentMethodPlaceholder',
                  defaultMessage: 'Select payment method...',
                })}
                options={[
                  {
                    label: 'Advanced Cash',
                    value: { type: TransactionDepositMethodType.AdvancedCash, id: 0 },
                  },
                  {
                    label: 'Visa/Mastercard',
                    value: { type: TransactionDepositMethodType.RoyalPayBankCard, id: 0 },
                  },
                  {
                    label: 'SEPA',
                    value: { type: TransactionDepositMethodType.BankAccount, id: 0 },
                  },
                ]}
                onChange={this.handlePaymentMethodChange}
                showError={!!this.store.paymentMethodError}
                errorMessage={this.store.paymentMethodError && intl.formatMessage({
                  id: this.store.paymentMethodError,
                  defaultMessage: 'Field is required',
                })}
                forceDropdown
            />
          </div>

          <div className='row'>
            <label className='form__label col-6'>
              <FormattedMessage id='depositAmount' defaultMessage='Deposit amount'/>:
            </label>
            <label className='form__label col-6 text-right'>{this.store.paymentAmountStringFixed}</label>
          </div>

          {!this.store.feeAmount.isZero() &&
          <div className='row'>
            <label className='form__label col-6'>
              <FormattedMessage id='dashboard.transactions.fee' defaultMessage='Fee'/>&nbsp;
              (<FormattedMessage id='dashboard.depositFiat.fixed' defaultMessage='Fixed' />):
            </label>
            <label className='form__label col-6 text-right'>
              {this.store.feeAmountString}
            </label>
          </div>
          }

          <div className='row mb-3'>
            <label className='form__label col-6'>
              <FormattedMessage id='dashboard.depositFiat.total' defaultMessage='Total' />:
            </label>
            <label className='form__label col-6 text-right'>{this.store.receiveAmountRaw}</label>
          </div>

          <Button name='modal'>
            <FormattedMessage id='dashboard.confirm' defaultMessage='Confirm' />
          </Button>
        </form>
      </Modal>
    );
  }
}

export default injectIntl(withRouter(DepositFiat));
