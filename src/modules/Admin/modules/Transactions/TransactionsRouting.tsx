import * as React from 'react';
import { Route, Switch } from 'react-router';
import TransactionContainer from './containers/TransactionContainer';
import AllTransactionsContainer from './containers/AllTransactionsContainer';
import DepositPending from './components/Deposit/DepositPending';
import DepositAll from './components/Deposit/DepositAll';
import DepositApproved from './components/Deposit/DepositApproved';
import DepositCompleted from './components/Deposit/DepositCompleted';
import DepositRejected from './components/Deposit/DepositRejected';
import WithdrawalAll from './components/Withdrawal/WithdrawalAll';
import WithdrawalPending from './components/Withdrawal/WithdrawalPending';
import WithdrawalTransfer from './components/Withdrawal/WithdrawalTransfer';
import WithdrawalCompleted from './components/Withdrawal/WithdrawalCompleted';
import WithdrawalRejected from './components/Withdrawal/WithdrawalRejected';
import ExchangePending from './components/Exchange/ExchangePending';
import ExchangeCompleted from './components/Exchange/ExchangeCompleted';
import ExchangeRejected from './components/Exchange/ExchangeRejected';
import ExchangeAll from './components/Exchange/ExchangeAll';
import ExchangeWithdrawalAll from './components/ExchangeWithdrawal/ExchangeWithdrawalAll';
import ExchangeWithdrawalPending from './components/ExchangeWithdrawal/ExchangeWithdrawalPending';
import ExchangeWithdrawalBoundaryExchangeApproved
  from './components/ExchangeWithdrawal/ExchangeWithdrawalBoundaryExchangeApproved';
import ExchangeWithdrawalTransfer from './components/ExchangeWithdrawal/ExchangeWithdrawalTransfer';
import ExchangeWithdrawalCompleted from './components/ExchangeWithdrawal/ExchangeWithdrawalCompleted';
import ExchangeWithdrawalRejected from './components/ExchangeWithdrawal/ExchangeWithdrawalRejected';
import DepositCreateTransaction from './components/Deposit/DepositCreateTransaction';
import DepositExchangeWithdrawalPending from './components/DepositExchangeWithdrawal/DepositExchangeWithdrawalPending';
import DepositExchangeWithdrawalApproved
    from './components/DepositExchangeWithdrawal/DepositExchangeWithdrawalApproved';
import DepositExchangeWithdrawalCompleted
    from './components/DepositExchangeWithdrawal/DepositExchangeWithdrawalCompleted';
import DepositExchangeWithdrawalPaymentFailed
    from './components/DepositExchangeWithdrawal/DepositExchangeWithdrawalPaymentFailed';
import DepositExchangeWithdrawalRejected
    from './components/DepositExchangeWithdrawal/DepositExchangeWithdrawalRejected';
import DepositExchangeWithdrawalTransfer
    from './components/DepositExchangeWithdrawal/DepositExchangeWithdrawalTransfer';
import DepositExchangeWithdrawalAll from './components/DepositExchangeWithdrawal/DepositExchangeWithdrawalAll';

class TransactionsRouting extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path='/admin/transactions/withdrawal/pending' component={WithdrawalPending} />
        <Route exact path='/admin/transactions/withdrawal/transfer' component={WithdrawalTransfer} />
        <Route exact path='/admin/transactions/withdrawal/completed' component={WithdrawalCompleted} />
        <Route exact path='/admin/transactions/withdrawal/rejected' component={WithdrawalRejected} />
        <Route exact path='/admin/transactions/withdrawal/all' component={WithdrawalAll} />

        <Route exact path='/admin/transactions/deposit/create' component={DepositCreateTransaction} />
        <Route exact path='/admin/transactions/deposit/pending' component={DepositPending} />
        <Route exact path='/admin/transactions/deposit/approved' component={DepositApproved} />
        <Route exact path='/admin/transactions/deposit/completed' component={DepositCompleted} />
        <Route exact path='/admin/transactions/deposit/rejected' component={DepositRejected} />
        <Route exact path='/admin/transactions/deposit/all' component={DepositAll} />

        <Route exact path='/admin/transactions/exchange/pending' component={ExchangePending} />
        <Route exact path='/admin/transactions/exchange/completed' component={ExchangeCompleted} />
        <Route exact path='/admin/transactions/exchange/rejected' component={ExchangeRejected} />
        <Route exact path='/admin/transactions/exchange/all' component={ExchangeAll} />

        <Route exact path='/admin/transactions/exchange_withdrawal/pending' component={ExchangeWithdrawalPending} />
        <Route exact path='/admin/transactions/exchange_withdrawal/boundary_exchange_approved'
               component={ExchangeWithdrawalBoundaryExchangeApproved} />
        <Route exact path='/admin/transactions/exchange_withdrawal/transfer' component={ExchangeWithdrawalTransfer} />
        <Route exact path='/admin/transactions/exchange_withdrawal/completed' component={ExchangeWithdrawalCompleted} />
        <Route exact path='/admin/transactions/exchange_withdrawal/rejected' component={ExchangeWithdrawalRejected} />
        <Route exact path='/admin/transactions/exchange_withdrawal/all' component={ExchangeWithdrawalAll} />

        <Route exact path='/admin/transactions/deposit_exchange_withdrawal/pending' component={DepositExchangeWithdrawalPending} />
        <Route exact path='/admin/transactions/deposit_exchange_withdrawal/approved' component={DepositExchangeWithdrawalApproved} />
        <Route exact path='/admin/transactions/deposit_exchange_withdrawal/completed' component={DepositExchangeWithdrawalCompleted} />
        <Route exact path='/admin/transactions/deposit_exchange_withdrawal/payment_failed' component={DepositExchangeWithdrawalPaymentFailed} />
        <Route exact path='/admin/transactions/deposit_exchange_withdrawal/rejected' component={DepositExchangeWithdrawalRejected} />
        <Route exact path='/admin/transactions/deposit_exchange_withdrawal/transfer' component={DepositExchangeWithdrawalTransfer} />
        <Route exact path='/admin/transactions/deposit_exchange_withdrawal/all' component={DepositExchangeWithdrawalAll} />

        <Route exact path='/admin/transactions/all' component={AllTransactionsContainer} />
        <Route path='/admin/transactions/:referenceId' component={TransactionContainer} />
      </Switch>
    );
  }
}

export default TransactionsRouting;
