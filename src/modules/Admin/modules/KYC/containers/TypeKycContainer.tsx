import * as React from 'react';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';
import { KycModel } from '../model/KycModel';
import { observer } from 'mobx-react';
import { lazyInject } from '../../../../IoC';
import { KycStore } from '../stores/KycStore';
import { Table } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router';
import { IInKycFiltersDTO } from '../dto/IInKycFiltersDTO';

interface IProps {
  filters?: IInKycFiltersDTO;
}

@observer
class TypeKycContainer extends React.Component<RouteComponentProps & IProps> {
  @lazyInject(KycStore)
  store: KycStore;

  componentWillMount() {
    if (this.props.filters) {
      this.store.fetchKyc(this.props.filters);
    } else {
      this.store.fetchKyc();
    }
  }

  columns: Array<ColumnProps<KycModel>> = [
    {
      title: 'Created',
      dataIndex: 'date',
      sorter: (a, b) => a.createDate.getTime() - b.createDate.getTime(),
      render: (text, record) => {
        return moment(record.createDate).format('DD.MM.YYYY | HH:mm:ss');
      },
    },
    {
      title: 'Account',
      children: [
        {
          title: 'ID',
          dataIndex: 'accountId',
        },
        {
          title: 'Email',
          dataIndex: 'accountEmail',
        },
        {
          title: 'Type',
          dataIndex: 'accountType',
        },
      ],
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
  ];

  render() {
    return (
      <Table<KycModel>
        columns={this.columns}
        dataSource={this.store.kyc}
        onRowClick={record => this.props.history.push(`/admin/kyc/${record.accountId}`)}
        bordered
        rowClassName={() => 'clickable'}
      />
    );
  }
}

export default withRouter(TypeKycContainer);
