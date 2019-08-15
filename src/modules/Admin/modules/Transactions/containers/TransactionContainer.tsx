import * as React from 'react';
import { observer } from 'mobx-react';
import { lazyInject } from '../../../../IoC';
import TransactionDetails from '../components/TransactionDetails';
import { RouteComponentProps } from 'react-router';
import { TransactionsStore } from '../stores/TransactionsStore';
import { TransactionModel } from '../../../../Shared/modules/Transactions/model/TransactionModel';
import { notification, Spin } from 'antd';
import ChangeStatus from '../components/ChangeStatus';
import { observable } from 'mobx';

interface IProps extends Partial<RouteComponentProps<{ referenceId?: string }>> {
  referenceId?: string;
}

@observer
class TransactionContainer extends React.Component<IProps> {

  @observable transaction = null;
  @observable notFound = false;

  @lazyInject(TransactionsStore)
  store: TransactionsStore;

  get referenceID() {
    return this.props.referenceId || this.props.match.params.referenceId;
  }

  componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.referenceId && (nextProps.referenceId !== this.props.referenceId)) {
      this.getTransaction(nextProps.referenceId).then(() => {
        this.store.fee = this.transaction && this.transaction.feeString;
        this.store.toAmount = this.transaction && this.transaction.toAmount.toString();
        this.store.fromAmount = this.transaction && this.transaction.fromAmount.toString();
      });
    }
  }

  componentWillMount() {
    this.getTransaction(this.referenceID).then(() => {
      this.store.fee = this.transaction && this.transaction.feeString;
      this.store.toAmount = this.transaction && this.transaction.toAmount.toString();
      this.store.fromAmount = this.transaction && this.transaction.fromAmount.toString();
    });
  }

  getTransaction = async (referenceId: string) => {
    try {
      this.transaction = await this.store.getTransactionByReferenceId(referenceId);
    } catch (e) {
      this.notFound = true;
    }
  };

  changeStatus = async (status, rejectReason) => {
    try {
      await this.store.changeTransactionStatus(this.referenceID, status, rejectReason);

      await this.getTransaction(this.referenceID);

      notification.success({
        message: 'Status successfully changed',
      });

      this.forceUpdate();
    } catch (e) {
      notification.error({
        message: 'Something went wrong...',
        description: 'Transaction status not changed',
      });
    }
  };

  render() {
    if (this.notFound) {
      return 'Transaction not found';
    }

    if (!this.transaction) {
      return <Spin tip='Searching transaction...' />;
    }

    return (
      <React.Fragment>
        <TransactionDetails transaction={this.transaction} />
        <ChangeStatus onStatusChange={this.changeStatus} possibleStatuses={this.transaction.possibleStatuses}/>
      </React.Fragment>
    );
  }
}

export default TransactionContainer;
