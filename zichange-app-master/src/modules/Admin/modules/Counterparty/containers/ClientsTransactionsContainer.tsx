import { RouteComponentProps, withRouter } from 'react-router';
import * as React from 'react';
import { lazyInject } from '../../../../IoC';
import { ColumnProps } from 'antd/lib/table';
import { message, Table } from 'antd';
import { ClientsTransactionsModel } from '../model/ClientsTransactionsModel';
import { ClientsTransactionsStore, FETCH_CLIENTS_TRANSACTIONS } from '../stores/ClientsTransactionsStore';
import { LoaderStore } from '../../../../Shared/modules/Loader/store/LoaderStore';
import { observer } from 'mobx-react';

@observer
class ClientsTransactionsContainer extends React.Component<RouteComponentProps> {

  @lazyInject(ClientsTransactionsStore)
  store: ClientsTransactionsStore;

  @lazyInject(LoaderStore)
  loaderStore: LoaderStore;

  columns: Array<ColumnProps<ClientsTransactionsModel>> = [
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Id',
      dataIndex: 'pairId',
    },
    {
      title: 'Amount',
      dataIndex: 'paymentAmount',
    },
    {
      title: 'To Amount',
      dataIndex: 'receiptAmount',
    },
    {
      title: 'Fee',
      dataIndex: 'fee',
    },
    {
      title: 'Wallet',
      dataIndex: 'wallet',
    },
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
    },
  ];

  componentWillMount(): void {
    this.store.fetchTransactions()
      .then(() => message.success('Transactions successful loaded'));
  }

  render() {

    if (this.loaderStore.hasTask(FETCH_CLIENTS_TRANSACTIONS)) {
      return null;
    }

    return(
      <>
        <Table<ClientsTransactionsModel>
          columns={this.columns}
          dataSource={this.store.transactions}
          bordered
        />
      </>
    );
  }
}

export default withRouter(ClientsTransactionsContainer);