import * as React from 'react';
import { lazyInject } from '../../../../../IoC';
import { TransactionsStore } from '../../stores/TransactionsStore';
import moment from 'moment';
import './style.scss';

class Referral extends React.Component {

  @lazyInject(TransactionsStore)
  private readonly store: TransactionsStore;

  render() {
    const { referralTransactions, partnerTotalAmount } = this.store;

    return (
      <React.Fragment>
        <div className='transactions__table referral-transactions'>
          <div className='row transactions__table_head'>
            <div className='col-2 col-lg-3  align-items-center not-sortable'>
              Date
            </div>
            <div className='col-2 align-items-center not-sortable'>
              Client ID
            </div>
            <div className='col-3 align-items-center not-sortable'>
              Transaction amount
            </div>
            <div className='col-2 align-items-center not-sortable'>
              Fee
            </div>
            <div className='col-3 col-lg-2 align-items-center not-sortable'>
              Partner reward
            </div>
          </div>
          { referralTransactions.length > 0 ?
            referralTransactions.map((transaction) =>
              <div key={transaction.referralId} className='row align-items-center transaction-row'>
                <div className='col-2 col-lg-3  align-items-center not-sortable'>
                  {moment(transaction.date).format('D MMM HH:mm')}
                </div>
                <div className='col-2 align-items-center not-sortable'>
                  {transaction.referralId}
                </div>
                <div className='col-3 align-items-center not-sortable'>
                  {`${transaction.transactionAmount} ${transaction.currency}`}
                </div>
                <div className='col-2 align-items-center not-sortable'>
                  {`${transaction.serviceFee} ${transaction.currency}`}
                </div>
                <div className='col-3 col-lg-2 align-items-center not-sortable'>
                  {`${transaction.amount} ${transaction.currency}`}
                </div>
              </div>,
            )
            :
            <div className='text--center'>
              <p className='p-3'>
                You have no transactions yet
              </p>
            </div>
          }
        </div>
        { referralTransactions.length > 0 &&
          partnerTotalAmount.map((referralBalance, id) =>
            <div key={id} className='text-right'>
              Total amount: {`${referralBalance.balance} ${referralBalance.currency}`}
            </div>,
          )
        }

      </React.Fragment>
    );
  }
}

export default Referral;