import * as React from 'react';
import { TransactionStatus } from './const/TransactionStatus';
import ProgressBar from './components/ProgressBar';

interface IProps {
  stepIndex: number;
}

class TransactionProgress extends React.Component<IProps> {
  render() {

    const STATUSES_LABEL = [
      TransactionStatus.Authorization,
      TransactionStatus.Verification,
      TransactionStatus.Payment,
      TransactionStatus.Status,
    ];

    return(
      <section>
        <ProgressBar steps={STATUSES_LABEL} stepIndex={this.props.stepIndex} />
        <div className='d-flex container justify-content-center'>
          {this.props.children}
        </div>
      </section>
    );
  }
}

export default TransactionProgress;