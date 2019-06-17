import * as React from 'react';
import classNames from 'classnames';
import DropdownIcon from '../../../../../Shared/components/DropdownIcon/DropdownIcon';
import { TransactionModel as TransactionModel } from '../../../../../Shared/modules/Transactions/model/TransactionModel';
import TransactionDetails from './TransactionDetails';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { BigNumber } from 'bignumber.js';
import { TransactionStatus } from '../../../../../Shared/modules/Transactions/const/TransactionStatus';
import { TransactionType } from '../../../../../Shared/modules/Transactions/const/TransactionType';
import { InjectedIntlProps, injectIntl } from 'react-intl';

interface IProps {
  transaction: TransactionModel;
  isOpen: boolean;
  onClick: (id: number) => void;
  amountToString(amount: BigNumber, currency: string): string;
}

class Transaction extends React.Component<IProps & InjectedIntlProps> {
  render() {

    const { isOpen, onClick, transaction, amountToString } = this.props;
    const transactionTypeLabels = {
      [TransactionType.Deposit]: this.props.intl.formatMessage({
        id: 'dashboard.transactions.filters.deposit',
        defaultMessage: 'Deposit',
      }),
      [TransactionType.Exchange]: this.props.intl.formatMessage({
        id: 'dashboard.transactions.filters.exchange',
        defaultMessage: 'Exchange',
      }),
      [TransactionType.Withdrawal]: this.props.intl.formatMessage({
        id: 'dashboard.transactions.filters.withdraw',
        defaultMessage: 'Withdrawal',
      }),
      [TransactionType.ExchangeWithdrawal]: this.props.intl.formatMessage({
        id: 'dashboard.transactions.filters.exchangeWithdrawal',
        defaultMessage: 'Exchange + Withdrawal',
      }),
    };

    const transactionStatus = {
      [TransactionStatus.Rejected]: this.props.intl.formatMessage({
        id: 'dashboard.transactions.status.rejected',
        defaultMessage: 'Rejected',
      }),
      [TransactionStatus.Pending]: this.props.intl.formatMessage({
        id: 'dashboard.transactions.status.pending',
        defaultMessage: 'Pending',
      }),
      [TransactionStatus.Approved]: this.props.intl.formatMessage({
        id: 'dashboard.transactions.status.approved',
        defaultMessage: 'Approved',
      }),
      [TransactionStatus.Transfer]: this.props.intl.formatMessage({
        id: 'dashboard.transactions.status.transfer',
        defaultMessage: 'Transfer',
      }),
      [TransactionStatus.Completed]: this.props.intl.formatMessage({
        id: 'dashboard.transactions.status.completed',
        defaultMessage: 'Completed',
      }),
    };



    const {
      id,
      status,
      date,
      type,
      currency,
      amount,
      referenceId,
    } = transaction;

    return (
      <div>
        <div className={classNames('row align-items-center transaction-row font-responsive', { 'active': isOpen })}
             onClick={() => onClick(id)}
        >
          <div className='col-3 d-none d-sm-block'>{moment(date).format('D MMM HH:mm')}</div>
          <div className='col-4 col-sm-3 col-md-3 transaction-row__type'>
            {transactionTypeLabels[type]}
          </div>
          <div className='col-2 d-none d-md-block'>{amountToString(amount, currency)}</div>
          <div className='col-4 col-sm-3 col-md-2'>{currency}</div>
          <div className='col-4 col-sm-3 col-md-2'>
            <span className={`status status-${status}`}>
              <Link to={`/dashboard/transactions/${referenceId}`}>
                {(status === TransactionStatus.BoundaryExchangeApproved ||
                  status === TransactionStatus.BoundaryDepositApproved) ? 'Approved' : transactionStatus[status]
                }
              </Link>
            </span>
          </div>

          <DropdownIcon rotated={isOpen} />
        </div>

        <TransactionDetails isOpen={isOpen} transaction={transaction} amountToString={amountToString}/>
      </div>
    );
  }
}

export default injectIntl(Transaction);