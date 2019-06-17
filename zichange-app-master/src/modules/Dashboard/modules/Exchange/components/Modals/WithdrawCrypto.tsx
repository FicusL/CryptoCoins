import * as React from 'react';
import Modal from '../../../../../Modals/components/ModalBase';

import Select from '../../../../../Shared/components/Inputs/Select';
import Button from '../../../../../Shared/components/Buttons/Button';
import { lazyInject } from '../../../../../IoC';
import { CryptoWalletsStore } from '../../../Profile/stores/CryptoWalletsStore';
import { WalletWithdrawCryptoStore } from '../../store/crypto/WalletWithdrawCryptoStore';
import { observer } from 'mobx-react';
import Input from '../../../../../Shared/components/Inputs/Input';
import { AccountStore } from '../../../Profile/stores/AccountStore';
import { RouteComponentProps, withRouter } from 'react-router';
import { TransactionWithdrawalMethodType } from '../../../../../Shared/modules/Transactions/const/TransactionWithdrawalMethodType';
import BigNumber from 'bignumber.js';
import { WalletStore } from '../../store/WalletStore';
import { InputWithdrawal } from '../../../../../Shared/components/Inputs/InputWithdrawal';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { ModalStore } from '../../../../../Modals/store/ModalStore';

interface IProps {
  currency: string;
  onClose: () => void;
}

@observer
class WithdrawCrypto extends React.Component<IProps & RouteComponentProps<any> & InjectedIntlProps> {
  @lazyInject(CryptoWalletsStore)
  walletsStore: CryptoWalletsStore;

  @lazyInject(WalletWithdrawCryptoStore)
  store: WalletWithdrawCryptoStore;

  @lazyInject(AccountStore)
  private readonly accountStore: AccountStore;

  @lazyInject(ModalStore)
  modalStore: ModalStore;

  @lazyInject(WalletStore)
  private readonly walletStore: WalletStore;

  handleAmountChange = ({ amount }) => this.store.receiveAmountChange(amount);

  handleCryptoWalletChange = ({ value }) =>
    this.store.receiveMethodChange(TransactionWithdrawalMethodType.CryptoWallet, value.id);

  handleTwoFAChange = ({ value }) => this.store.twoFACodeChange(value);

  handleSubmit = e => {
    e.preventDefault();

    if (this.store.validate()) {
      this.store.submit().then(transactionReferenceId => {
        if (!transactionReferenceId) {
          return;
        }

        this.props.onClose();
        this.props.history.push('/dashboard/transactions/' + transactionReferenceId);
      });
    }
  };

  componentWillUnmount() {
    this.store.reset();
  }

  handleAdd = () => this.modalStore.openModal('ADD_WALLET');

  render() {
    const balance = this.walletStore.cryptoBalances.get(this.props.currency).isEqualTo(new BigNumber(0))
      ? new BigNumber(0).toString()
      : this.walletStore.cryptoBalances.get(this.props.currency).toFixed(8);

    const { intl } = this.props;

    // TODO: delete this shit
    const isEmpty = Array.from(this.walletsStore.wallets.values()).length < 1;
    const arr = Array.from(this.walletsStore.wallets.values()).map(wallet => (
      {
        label: `${wallet.label} - ...${wallet.address.slice(-8)}`,
        value: wallet,
      }));

    const addArr = [{label: 'Add new crypto', value: this.handleAdd}];

    return (
      <Modal onRequestClose={this.props.onClose} className='wallet-modal'>
        <Modal.Title>
          <FormattedMessage id='dashboard.exchange.withdraw' defaultMessage='Withdraw' /> {this.props.currency}
        </Modal.Title>

        <form onSubmit={this.handleSubmit}>
          <InputWithdrawal
            name='withdrawCryptoAmount'
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
            name='withdrawCryptoWallet'
            label={`${intl.formatMessage({
              id: 'dashboard.withdrawCrypto.wallet',
              defaultMessage: 'Wallet',
            })} ${this.props.currency}`}
            placeholder={intl.formatMessage({
              id: 'dashboard.withdrawCrypto.walletPlaceholder',
              defaultMessage: 'Select your crypto wallet',
            })}
            onChange={this.handleCryptoWalletChange}
            options={isEmpty ? addArr : arr}
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
            <label className='form__label col-6 text-right'>
              {this.store.feeAmount.isZero() ?
                <FormattedMessage id='dashboard.exchange.noFee' defaultMessage='no fee' />
                : this.store.feeAmountString}
            </label>
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

export default injectIntl(withRouter(WithdrawCrypto));
