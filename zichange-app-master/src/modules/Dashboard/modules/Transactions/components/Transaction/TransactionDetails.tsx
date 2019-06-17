import * as React from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { TransactionModel } from '../../../../../Shared/modules/Transactions/model/TransactionModel';
import { Link } from 'react-router-dom';
import { TransactionStatus } from '../../../../../Shared/modules/Transactions/const/TransactionStatus';
import { BigNumber } from 'bignumber.js';
import Button from '../../../../../Shared/components/Buttons/Button';
import { FormattedMessage } from 'react-intl';

interface IProps {
  isOpen: boolean;
  transaction: TransactionModel;
  amountToString(amount: BigNumber, currency: string): string;
}

class TransactionDetails extends React.Component<IProps> {
  render() {
    const { isOpen, transaction, amountToString } = this.props;

    if (transaction.status === TransactionStatus.Rejected) {
      return (
        <div className={classNames('row transaction-info', { 'opened': isOpen } )}>
          <div className='col-12'>
            <FormattedMessage
              id='dashboard.transactions.transactionWasRejected'
              defaultMessage='Transaction was rejected by this reason'
            />:
            <span className='value'>
              {transaction.rejectReason} ({transaction.rejectStatus})
            </span>
          </div>
        </div>
      );
    }

    const {
      date,
      referenceId,
      feeString,
      fromAmount,
      fromCurrency,
      toAmount,
      toCurrency,
    } = transaction;

    // TODO: Check rate
    return (
      <div className={classNames('row transaction-info', { 'opened': isOpen } )}>
        <div className='col-12 col-md-6 col-lg-4'>
          <FormattedMessage
            id='dashboard.transactions.date'
            defaultMessage='Date'
          />:&nbsp;
          <span className='value'>{moment(date).format('DD MMMM YYYY HH:mm:ss')}</span>
        </div>
        <div className='col-12 col-md-6 col-lg-4'>
          <FormattedMessage
            id='dashboard.transactions.from'
            defaultMessage='From'
          />:&nbsp;
          <span className='value'>{amountToString(fromAmount, fromCurrency)} {fromCurrency}</span>
        </div>
        <div className='col-12 col-md-6 col-lg-4'>
          <FormattedMessage
            id='dashboard.transactions.to'
            defaultMessage='To'
          />:&nbsp;
          <span className='value'>{amountToString(toAmount, toCurrency)} {toCurrency}</span>
        </div>
        <div className='col-12 col-md-6 col-lg-4'>
          <FormattedMessage
            id='dashboard.transactions.fee'
            defaultMessage='Fee'
          />:&nbsp;
          <span className='value'>{feeString} {toCurrency}</span>
        </div>
        {transaction.exchange &&
          <div className='col-12 col-md-6 col-lg-4'>
              <React.Fragment>
                <FormattedMessage id='dashboard.transactions.rate' defaultMessage='Rate' />&nbsp;
                  {`${transaction.exchange.from.currency}/${transaction.exchange.to.currency}`}: {' '}
                  <span className='value'>{transaction.exchange.rate.toFixed(8)}</span>
              </React.Fragment>
          </div>
        }
        <div className='col-12 col-md-6 col-lg-4'>
          <FormattedMessage
            id='dashboard.transactions.referenceId'
            defaultMessage='Reference ID'
          />:&nbsp;
          <span className='value'>{referenceId}</span>
        </div>
        <div className='col-12 pt-2'>
          <Link className='payment-details-link' to={`/dashboard/transactions/${referenceId}`}>
            <Button name='sell'>
              <FormattedMessage id='dashboard.transactions.moreInfo' defaultMessage='More Info' />
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}

export default TransactionDetails;