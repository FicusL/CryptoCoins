import React from 'react';
import TypeTransactionsContainer from '../../containers/TypeTransactionsContainer';
import { TransactionsStore } from '../../stores/TransactionsStore';
import { lazyInject } from '../../../../../IoC';
import { TransactionType } from '../../../../../Shared/modules/Transactions/const/TransactionType';
import { IInTransactionsFiltersDTO } from '../../dto/IInTransactionsFiltersDTO';

class ExchangeWithdrawalAll extends React.Component {

  @lazyInject(TransactionsStore)
  store: TransactionsStore;

  render() {

    const filters : IInTransactionsFiltersDTO = { type: TransactionType.ExchangeWithdrawal };

    return(
      <TypeTransactionsContainer filters={filters} />
    );
  }
}

export default ExchangeWithdrawalAll;