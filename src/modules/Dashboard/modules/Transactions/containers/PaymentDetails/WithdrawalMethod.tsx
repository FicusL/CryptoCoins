import * as React from 'react';
import { TransactionWithdrawalMethodType } from '../../../../../Shared/modules/Transactions/const/TransactionWithdrawalMethodType';
import { TransactionWithdrawalMethodModel } from '../../../../../Shared/modules/Transactions/model/parts/TransactionWithdrawalMethodModel';
import { FormattedMessage } from 'react-intl';

interface IProps {
  withdrawalMethod: TransactionWithdrawalMethodModel;
  currency: string;
}

class WithdrawalMethod extends React.Component<IProps> {
  BankAccount = () => {
    const bank = this.props.withdrawalMethod.data;
    return (
      <div>
        <h4>{bank.bankName} ({bank.currency})</h4>
        <p className='header_description'>{bank.IBAN}</p>
      </div>
    );
  };

  CryptoWallet = () => {
    const wallet = this.props.withdrawalMethod.data;
    const { currency } = this.props;

    return (
      <div>
        <h4>
          <FormattedMessage id='dashboard.transactions.withdrawalMethod.your'/>&nbsp;
          {currency}&nbsp;
          <FormattedMessage id='dashboard.transactions.depositMethod.cryptocurrencyWallet'/>
        </h4>
        <p className='header_description'>{wallet.label} : {wallet.address}</p>
      </div>
    );
  };

  methods = {
    [TransactionWithdrawalMethodType.BankAccount]: this.BankAccount,
    [TransactionWithdrawalMethodType.CryptoWallet]: this.CryptoWallet,
  };

  render() {
    const { withdrawalMethod } = this.props;
    return this.methods[withdrawalMethod.type]();
  }
}

export default WithdrawalMethod;