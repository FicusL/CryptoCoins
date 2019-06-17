import * as React from 'react';
import { Button, Input, Modal } from 'antd';
import { KycStatus } from '../../../../../Dashboard/modules/Profile/constants/KycStatus';


interface IState {
  showModal: boolean;
  rejectReason?: string;
}

interface IProps {
  changeStatus: (status: KycStatus, rejectReason?: string) => void;
}

class ChangeKycStatus extends React.Component<IProps, IState> {
  state: IState = { showModal: false };

  handleApprove = () => this.props.changeStatus(KycStatus.Tier1Approved);

  handleReject = () => this.props.changeStatus(KycStatus.Tier1Rejected, this.state.rejectReason);

  handleRejectReasonChange = ({ target }) => this.setState({ rejectReason: target.value });

  render() {
    return (
      <div>
        <Button type='primary' onClick={this.handleApprove} size='large' className='mr-3'>Approve</Button>
        <Button type='danger' onClick={() => this.setState({ showModal: true })} size='large'>Reject</Button>

        <Modal
          visible={this.state.showModal}
          title='Reject'
          onCancel={() => this.setState({ showModal: false })}
          onOk={this.handleReject}
        >
          <Input
            placeholder='Please provide reject reason'
            onChange={this.handleRejectReasonChange}
          />
        </Modal>
      </div>
    );
  }
}

export default ChangeKycStatus;
