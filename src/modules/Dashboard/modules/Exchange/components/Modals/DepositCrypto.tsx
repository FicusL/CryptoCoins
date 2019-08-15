import * as React from 'react';
import Modal from '../../../../../Modals/components/ModalBase';
import copy from 'copy-to-clipboard';
import IconCopy from '../../../../../Shared/assets/images/modals/copy.png';
import { lazyInject } from '../../../../../IoC';
import { WalletDepositCryptoStore } from '../../store/crypto/WalletDepositCryptoStore';
import { RouteComponentProps, withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';

interface IProps {
  currency: string;
  onClose: () => void;
}

class DepositCrypto extends React.Component<IProps & RouteComponentProps<any>> {
  @lazyInject(WalletDepositCryptoStore)
  store: WalletDepositCryptoStore;

  render() {
    return (
      <Modal onRequestClose={this.props.onClose} className='wallet-modal'>
        <Modal.Title>
          <FormattedMessage id='dashboard.exchange.deposit' defaultMessage='Deposit' /> {this.props.currency}
        </Modal.Title>
        <h3 className='mb-2 text-center'>
          <FormattedMessage id='dashboard.depositCrypto.walletAddress' defaultMessage='Your wallet address' />
        </h3>
        <div className='mb-4 d-flex justify-content-center align-items-center'>
          <p className='mb-0 mr-3 wallet-modal__address'>
            {this.store.selectedCurrencyWalletAddress(this.props.currency)}
          </p>
          <img src={IconCopy}
               width='18'
               height='20'
               style={{cursor: 'pointer'}}
               onClick={() => copy(this.store.selectedCurrencyWalletAddress(this.props.currency))}
               alt='Copy'
          />
        </div>
        <div className='qr-code'>
          <img src={this.store.selectedCurrencyWalletAddressQR(this.props.currency)}
               alt='QR code' width='200' height='200'
          />
        </div>


        <div className='row mb-4'>
          <label className='form__label col-6'>
            <FormattedMessage id='dashboard.transactions.fee' defaultMessage='Fee'/>&nbsp;
            (<FormattedMessage id='dashboard.depositFiat.fixed' defaultMessage='Fixed' />):
          </label>
          <label className='form__label col-6 text-right'>
            <FormattedMessage id='dashboard.exchange.noFee' defaultMessage='no fee' />
          </label>
        </div>


        <p className='text-center'>
          <FormattedMessage
            id='dashboard.depositCrypto.note'
            defaultMessage='Send your Bitcoin (BTC) to this address. It will be credited after 6 confirmations.'
          />
        </p>
      </Modal>
    );
  }
}

export default withRouter(DepositCrypto);