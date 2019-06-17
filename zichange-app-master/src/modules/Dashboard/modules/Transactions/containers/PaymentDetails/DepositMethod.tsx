import * as React from 'react';
import { TransactionDepositMethodType } from '../../../../../Shared/modules/Transactions/const/TransactionDepositMethodType';
import { FormattedMessage } from 'react-intl';

interface IProps {
  depositMethodType: TransactionDepositMethodType;
  currency?: string;
  email?: string;
}

class PaymentMethod extends React.Component<IProps> {
  BankAccount = () => {
    return (
      <div>
        <h4><FormattedMessage id='dashboard.transactions.depositMethod.sepa' defaultMessage='SEPA'/></h4>
      </div>
    );
  };

  CryptoWallet = () => {
    return (
      <div>
        <h4>{this.props.currency}&nbsp;
        <FormattedMessage
          id='dashboard.transactions.depositMethod.cryptocurrencyWallet'
          defaultMessage='cryptocurrency wallet'
        />
        </h4>
      </div>
    );
  };

  AdvancedCash = () => {
    return (
      <div>
        <h4>
          <FormattedMessage
            id='dashboard.transactions.depositMethod.advancedCash.title'
            defaultMessage='Advanced Cash'
          />
        </h4>
        <p className='header_description'>
          <FormattedMessage
            id='dashboard.transactions.depositMethod.advancedCash.description'
            defaultMessage='You will be redirected to Advanced Cash to proceed'
          />
        </p>
      </div>
    );
  };

  // Payeer = () => {
  //   return (
  //     <div>
  //       <h4>
  //         <FormattedMessage
  //           id='dashboard.transactions.depositMethod.payeer.title'
  //           defaultMessage='Payeer'
  //         />
  //       </h4>
  //       <p className='header_description'>
  //         <FormattedMessage
  //           id='dashboard.transactions.depositMethod.payeer.description'
  //           defaultMessage='You will be redirected to PAYEER to proceed'
  //         />
  //       </p>
  //     </div>
  //   );
  // };


  methods = {
    [TransactionDepositMethodType.BankAccount]: this.BankAccount,
    [TransactionDepositMethodType.CryptoWallet]: this.CryptoWallet,
    [TransactionDepositMethodType.AdvancedCash]: this.AdvancedCash,
    // [TransactionDepositMethodType.Payeer]: this.Payeer,
  };

  render() {
    const { depositMethodType } = this.props;

    if (!this.methods[depositMethodType]) {
      return null;
    }

    return this.methods[depositMethodType]();
  }
}

export default PaymentMethod;