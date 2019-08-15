import * as React from 'react';
import { TransactionDepositMethodType } from '../../../../../Shared/modules/Transactions/const/TransactionDepositMethodType';
import IconCopy from '../../../../../Shared/assets/images/modals/copy-white.png';
import {
  IBankAccountZichangeRequisitesData,
  ICryptoWalletZichangeRequisitesData,
} from '../../../../../Shared/modules/Transactions/abstract/ITransactionZichangeRequisites';
import copy from 'copy-to-clipboard';
import { TransactionDepositPartModel } from '../../../../../Shared/modules/Transactions/model/parts/TransactionDepositPartModel';
import { FormattedMessage } from 'react-intl';

interface IProps {
  deposit: TransactionDepositPartModel;
  referenceId: string;
}

class ZichangeRequisites extends React.Component<IProps> {

  CryptoWallet = () => {
    const { amount, currency, zichangeRequisites, zichangeRequisitesQRCode } = this.props.deposit;
    const wallet = zichangeRequisites.data as ICryptoWalletZichangeRequisitesData;

    return (
      <div className='payment-details__table'>
        <h2 className='header text-center text-lg-left'>
          <FormattedMessage
            id='dashboard.transactions.requisites.headerPart1'
            defaultMessage='Please send'
          /> &nbsp;
          {amount} {currency} &nbsp;
          <FormattedMessage
            id='dashboard.transactions.requisites.crypto.headerPart2'
            defaultMessage='to the following wallet. The whole amount should be sent as one transaction'
          />
        </h2>
        <div className='row'>
          <div className='col-12 text--center mb-4 payment-details__wallet'>
            <p className='payment-details__wallet__address'>{wallet.address}</p>
            <img src={IconCopy}
                 width='18'
                 height='20'
                 style={{cursor: 'pointer'}}
                 onClick={() => copy(wallet.address)}
                 alt='Copy'
            />
            <p className='payment-details__wallet__label'>Copy address</p>
          </div>
          <div className='col-12 text--center qr-code'>
            <span>
               <FormattedMessage
                 id='dashboard.transactions.requisites.orScanCode'
                 defaultMessage='Or scan qr-code'
               />
            </span>
            <div>
              <img src={zichangeRequisitesQRCode} alt='QR code'/>
            </div>
          </div>
        </div>
      </div>
    );
  };

  BankAccount = () => {
    const { amount, currency, zichangeRequisites } = this.props.deposit;
    const bankAccount = zichangeRequisites.data as IBankAccountZichangeRequisitesData;

    return (
      <div className='payment-details__table'>
        <h2 className='header text-center text-lg-left'>
          <FormattedMessage
            id='dashboard.transactions.requisites.headerPart1'
            defaultMessage='Please send'
          /> &nbsp;
          {amount.toString()} {currency} &nbsp;
          <FormattedMessage
            id='dashboard.transactions.requisites.fiat.headerPart2'
            defaultMessage='to the following bank account. The whole amount should be sent as one transaction'
          />
        </h2>
        <div className='row align-items-center justify-content-between table__row'>
          <div className='col-6'>
            <FormattedMessage id='dashboard.settings.addBankAccount.accountName' defaultMessage='Account name' />:
          </div>
          <div className='col-6 text-right'>
            <p>BaGuk Finance OÜ</p>
          </div>
        </div>
        <div className='row align-items-center justify-content-between table__row'>
          <div className='col-6'>
            <FormattedMessage id='dashboard.settings.addBankAccount.address' defaultMessage='Address' />:
          </div>
          <div className='col-6 text-right'>
            <p>Narva mnt 13, 10151, Tallinn, Estonia</p>
          </div>
        </div>
        <div className='row align-items-center justify-content-between table__row'>
          <div className='col-6'>
            <FormattedMessage id='dashboard.settings.addBankAccount.bankName' defaultMessage='Bank name' />:
          </div>
          <div className='col-6 text-right'>
            <p>UAB Mistertango</p>
          </div>
        </div>
        <div className='row align-items-center justify-content-between table__row'>
          <div className='col-6'>
            <FormattedMessage id='dashboard.transactions.requisites.iban' defaultMessage='IBAN' />:
          </div>
          <div className='col-6 text-right'>
            <p>LT043510000013885157</p>
          </div>
        </div>
        <div className='row align-items-center justify-content-between table__row'>
          <div className='col-6'>
            <FormattedMessage id='dashboard.transactions.requisites.swift' defaultMessage='SWIFT/BIC' />:
          </div>
          <div className='col-6 text-right'>
            <p>MIEGLT21XXX</p>
          </div>
        </div>
        <div className='row align-items-center justify-content-between table__row'>
          <div className='col-6'>
            <FormattedMessage id='dashboard.transactions.requisites.bankAddress' defaultMessage='Bank address' />:
          </div>
          <div className='col-6 text-right'>
            <p>Perkunkiemio 2, 12126, Vilnius, Lithuania</p>
          </div>
        </div>
        <div className='row align-items-center justify-content-between table__row'>
          <div className='col-6'>
            <FormattedMessage
              id='dashboard.transactions.transactionReferenceID'
              defaultMessage='Transaction reference ID'
            />:
          </div>
          <div className='col-6 text-right'>
            {this.props.referenceId}
          </div>
        </div>
      </div>
    );
  };

  methods = {
    [TransactionDepositMethodType.CryptoWallet]: this.CryptoWallet,
    [TransactionDepositMethodType.BankAccount]: this.BankAccount,
  };

  render() {
    const { zichangeRequisites } = this.props.deposit;

    if (!zichangeRequisites) {
      return null;
    }

    if (!this.methods[zichangeRequisites.type]) {
      return (<div />);
    }

    return this.methods[zichangeRequisites.type]();
  }
}

export default ZichangeRequisites;