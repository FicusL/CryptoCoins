import * as React from 'react';
import { lazyInject } from '../../../../../IoC';
import { TransactionsStore } from '../../stores/TransactionsStore';
import { IInTransactionsFiltersDTO } from '../../dto/IInTransactionsFiltersDTO';
import { TransactionType } from '../../../../../Shared/modules/Transactions/const/TransactionType';
import TypeTransactionsContainer from '../../containers/TypeTransactionsContainer';

class DepositExchangeWithdrawalAll extends React.Component {
  @lazyInject(TransactionsStore)
  store: TransactionsStore;

  render() {

    const filters : IInTransactionsFiltersDTO = {
      type: TransactionType.DepositExchangeWithdrawal,
    };

    return(
      <TypeTransactionsContainer filters={filters} />
    );
  }
}

export default DepositExchangeWithdrawalAll;