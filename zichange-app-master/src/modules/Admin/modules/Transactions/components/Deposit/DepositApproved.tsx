import React from 'react';
import TypeTransactionsContainer from '../../containers/TypeTransactionsContainer';
import { TransactionsStore } from '../../stores/TransactionsStore';
import { lazyInject } from '../../../../../IoC';
import { TransactionStatus } from '../../../../../Shared/modules/Transactions/const/TransactionStatus';
import { TransactionType } from '../../../../../Shared/modules/Transactions/const/TransactionType';
import { IInTransactionsFiltersDTO } from '../../dto/IInTransactionsFiltersDTO';

class DepositApproved extends React.Component {

  @lazyInject(TransactionsStore)
  store: TransactionsStore;

  render() {

    const filters : IInTransactionsFiltersDTO = { type: TransactionType.Deposit, status: TransactionStatus.Approved };

    return(
      <TypeTransactionsContainer filters={filters} />
    );
  }
}

export default DepositApproved;