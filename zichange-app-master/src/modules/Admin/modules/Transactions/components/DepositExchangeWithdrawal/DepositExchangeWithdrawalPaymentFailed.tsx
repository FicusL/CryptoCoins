import * as React from 'react';
import { lazyInject } from '../../../../../IoC';
import { TransactionsStore } from '../../stores/TransactionsStore';
import { IInTransactionsFiltersDTO } from '../../dto/IInTransactionsFiltersDTO';
import { TransactionType } from '../../../../../Shared/modules/Transactions/const/TransactionType';
import { TransactionStatus } from '../../../../../Shared/modules/Transactions/const/TransactionStatus';
import TypeTransactionsContainer from '../../containers/TypeTransactionsContainer';

class DepositExchangeWithdrawalPaymentFailed extends React.Component {
  @lazyInject(TransactionsStore)
  store: TransactionsStore;

  render() {

    const filters : IInTransactionsFiltersDTO = {
      type: TransactionType.DepositExchangeWithdrawal,
      status: TransactionStatus.PaymentFailed,
    };

    return(
      <TypeTransactionsContainer filters={filters} />
    );
  }
}

export default DepositExchangeWithdrawalPaymentFailed;