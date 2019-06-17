import * as React from 'react';
import { observer } from 'mobx-react';
import { lazyInject } from '../../../../IoC';
import { TransactionsStore } from '../stores/TransactionsStore';
import { message, Modal, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { TransactionModel } from '../../../../Shared/modules/Transactions/model/TransactionModel';
import moment from 'moment';
import TransactionContainer from './TransactionContainer';
import { IInTransactionsFiltersDTO } from '../dto/IInTransactionsFiltersDTO';
import { observable } from 'mobx';


interface IState {
  showModal: boolean;
  referenceId: string;
}

interface IProps {
  filters: IInTransactionsFiltersDTO;
}

@observer
class TypeTransactionsContainer extends React.Component<IProps, IState> {
  state: IState = { showModal: false, referenceId: '' };

  @lazyInject(TransactionsStore)
  store: TransactionsStore;

  @observable statusChanged: boolean = false;

  componentWillMount() {
    this.store.fetchTransactions(this.props.filters)
        .then(() => message.success('Transactions successful loaded'));
  }

  columns: Array<ColumnProps<TransactionModel>> = [
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Created',
      dataIndex: 'date',
      sortOrder: 'descend',
      sorter: (a, b) => a.date.getTime() - b.date.getTime(),
      render: (text, record) => {
        return moment(record.date).format('DD.MM.YYYY | HH:mm:ss');
      },
    },
    {
      title: 'Reference ID',
      dataIndex: 'referenceId',
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Status',
      dataIndex: 'statusString',
    },
  ];

  closeModal = () => {
    this.setState({
      showModal: false,
      referenceId: '',
    });

    this.store.changeFeeTransaction(this.state.referenceId, this.store.fee);
    this.store.changeToAmountTransaction(this.state.referenceId, this.store.toAmount);
    this.store.changeFromAmountTransaction(this.state.referenceId, this.store.fromAmount);

    this.store.fetchTransactions(this.props.filters);
  };

  render() {

    return (
      <>
        <Table<TransactionModel>
          columns={this.columns}
          dataSource={this.store.transactions}
          onRowClick={record => this.setState({ referenceId: record.referenceId, showModal: true })}
          rowClassName={() => 'clickable'}
        />

        <Modal
          title={this.state.referenceId}
          visible={this.state.showModal}
          footer={null}
          onCancel={this.closeModal}>
          <TransactionContainer referenceId={this.state.referenceId} />
        </Modal>
      </>
    );
  }
}

export default TypeTransactionsContainer;
