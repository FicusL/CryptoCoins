import * as React from 'react';
import { Button, Input, Radio } from 'antd';
import { TransactionStatus } from '../../../../Shared/modules/Transactions/const/TransactionStatus';
import { RadioChangeEvent } from 'antd/lib/radio';


interface IProps {
  onStatusChange: (status: TransactionStatus, rejectReason?: string) => void;
  possibleStatuses: string[];
}

interface IState {
  changeAble: boolean;
  status?: TransactionStatus;
  rejectReason?: string;
}

class ChangeStatus extends React.Component<IProps, IState> {
  state: IState = { changeAble: false };

  handleChange = ({ target }: RadioChangeEvent) => {
    this.setState({ status: target.value });
  };

  changeStatus = () => {
    this.props.onStatusChange(this.state.status, this.state.rejectReason);
    this.setState({ changeAble: false });
  };

  render() {
    if (!this.state.changeAble) {
      return <Button onClick={() => this.setState({ changeAble: true })}>Change status</Button>;
    }

    const { possibleStatuses } = this.props;

    return (
      <div>
        <Radio.Group onChange={this.handleChange} value={this.state.status} className='mb-2'>
          {possibleStatuses.map(s => <Radio key={s} value={s}>{s}</Radio>)}
          <Radio value={TransactionStatus.Rejected}>{TransactionStatus.Rejected}</Radio>
        </Radio.Group>

        {this.state.status === TransactionStatus.Rejected &&
          <Input.TextArea
              placeholder='Please provide reject reason'
              autosize={{ minRows: 2, maxRows: 6 }}
              onChange={({ target }) => this.setState({ rejectReason: target.value })}
              className='mb-3'
          />
        }

        <Button type='primary' onClick={this.changeStatus}>Confirm</Button>
      </div>
    );
  }
}

export default ChangeStatus;
