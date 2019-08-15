import * as React from 'react';
import './style.scss';
import moment from 'moment';
import { observer } from 'mobx-react';
import { lazyInject } from '../../../../../IoC';
import { ModalStore } from '../../../../../Modals/store/ModalStore';
import ProgressBar from '../../../../../Shared/components/ProgressBar/ProgressBar';
import { TransactionModel } from '../../../../../Shared/modules/Transactions/model/TransactionModel';
import { TransactionStatus } from '../../../../../Shared/modules/Transactions/const/TransactionStatus';
import { InjectedIntlProps, injectIntl } from 'react-intl';

interface IProps {
  transaction: TransactionModel;
}

@observer
class TransactionProgress extends React.Component<IProps & InjectedIntlProps> {
  @lazyInject(ModalStore)
  modalStore: ModalStore;

  render() {
    const { status, rejectStatus, expectedDate, possibleStatuses } = this.props.transaction;
    const { intl } = this.props;

    const STATUSES_LABELS = {
      [TransactionStatus.Pending]: intl.formatMessage({
        id: 'dashboard.transactions.status.pending',
        defaultMessage: 'Pending',
      }),
      [TransactionStatus.Approved]: intl.formatMessage({
        id: 'dashboard.transactions.status.approved',
        defaultMessage: 'Approved',
      }),
      [TransactionStatus.Transfer]: intl.formatMessage({
        id: 'dashboard.transactions.status.transfer',
        defaultMessage: 'Transfer',
      }),
      [TransactionStatus.Completed]: intl.formatMessage({
        id: 'dashboard.transactions.status.completed',
        defaultMessage: 'Completed',
      }),
      [TransactionStatus.BoundaryDepositApproved]: intl.formatMessage({
        id: 'dashboard.transactions.status.boundaryDepositApproved',
        defaultMessage: 'Deposit approved',
      }),
      [TransactionStatus.BoundaryExchangeApproved]: intl.formatMessage({
        id: 'dashboard.transactions.status.boundaryExchangeApproved',
        defaultMessage: 'Exchange approved',
      }),
    };

    const steps = possibleStatuses.map((status) => STATUSES_LABELS[status]);
    const stepIndex = steps.indexOf(STATUSES_LABELS[
      status !== TransactionStatus.Rejected
        ? status
        : rejectStatus
    ]);

    if (status === TransactionStatus.Rejected) {
      steps[stepIndex] = `Rejected (${STATUSES_LABELS[rejectStatus]})`;
    }

    return (
      <section className={`operation-progress operation-progress__${status}`}>
        <ProgressBar steps={steps} stepIndex={stepIndex} />
        <p className='text-right header_description'>{moment(expectedDate).format('DD.MM.YYYY')}</p>
      </section>
    );
  }
}

export default injectIntl(TransactionProgress);
