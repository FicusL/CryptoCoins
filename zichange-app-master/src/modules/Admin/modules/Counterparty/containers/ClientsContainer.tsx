import { RouteComponentProps, withRouter } from 'react-router';
import * as React from 'react';
import { ColumnProps } from 'antd/lib/table';
import { ClientsModel } from '../model/ClientsModel';
import { lazyInject } from '../../../../IoC';
import { ClientsStore } from '../stores/ClientsStore';
import { message, Table } from 'antd';
import { observer } from 'mobx-react';

@observer
class ClientsContainer extends React.Component<RouteComponentProps> {

  @lazyInject(ClientsStore)
  store: ClientsStore;

  columns: Array<ColumnProps<ClientsModel>> = [
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Limit Balance',
      dataIndex: 'limitBalance',
    },
    {
      title: 'Transactions Amount',
      dataIndex: 'transactionsAmount',
    },
    {
      title: 'Fees Amount',
      dataIndex: 'feesAmount',
    },
  ];

  componentWillMount(): void {
    this.store.getClients()
      .then(() => message.success('Clients successful loaded'));
  }

  render() {

    return(
      <Table<ClientsModel>
        columns={this.columns}
        dataSource={this.store.clients}
        bordered
      />
    );
  }
}

export default withRouter(ClientsContainer);