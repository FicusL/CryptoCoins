import * as React from 'react';
import { ColumnProps } from 'antd/lib/table';
import { ClientsModel } from '../Counterparty/model/ClientsModel';
import { observer } from 'mobx-react';
import { lazyInject } from '../../../IoC';
import { AdminClientsStore } from './stores/AdminClientsStore';
import { message, Table } from 'antd';
import Search from 'antd/es/input/Search';
import { observable } from 'mobx';
import moment from 'moment';

@observer
class AdminClientsContainer extends React.Component {

  @lazyInject(AdminClientsStore)
  store: AdminClientsStore;

  @observable clients: ClientsModel[];

  columns: Array<ColumnProps<ClientsModel>> = [
    {
      title: 'Created',
      dataIndex: 'registrationDate',
      sortOrder: 'descend',
      sorter: (a, b) => a.date.getTime() - b.date.getTime(),
      render: (text, record) => {
        return moment(record.date).format('DD.MM.YYYY | HH:mm:ss');
      },
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Status',
      dataIndex: 'kycStatus',
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
    this.store.getAllClients().then(() => {
      this.clients = this.store.clients;
      message.success('Clients successful loaded');
    });
  }

  handleSearchChange = (e) => {
    this.clients = e.target.value === ''
      ? this.store.clients
      : this.store.clients.filter((client) => client.email.includes(e.target.value));
  };

  render() {
    return(
      <>
        <Search
          placeholder='Enter email..'
          onChange={this.handleSearchChange}
          style={{ width: 200 }}
          className='mb-3'
        />
        <Table<ClientsModel>
          columns={this.columns}
          dataSource={this.clients}
          bordered
        />
      </>

    );
  }
}

export default AdminClientsContainer;