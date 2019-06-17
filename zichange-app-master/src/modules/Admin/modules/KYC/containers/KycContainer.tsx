import * as React from 'react';
import { observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import { lazyInject } from '../../../../IoC';
import { KycStore } from '../stores/KycStore';
import KycPDF from '../components/KycPDF/KycPDF';
import ChangeKycStatus from '../components/ChangeStatus/ChangeKycStatus';
import { KycStatus } from '../../../../Dashboard/modules/Profile/constants/KycStatus';
import { KycModel } from '../model/KycModel';
import KycInfo from '../components/KycInfo/KycInfo';
import { notification, Spin } from 'antd';

interface IState {
  kyc: KycModel | null;
}

@observer
class KycContainer extends React.Component<RouteComponentProps<{ accountId: string }>, IState> {
  state: IState = { kyc: null };

  @lazyInject(KycStore)
  store: KycStore;

  get accountId() {
    return this.props.match.params.accountId;
  }

  get pdfUrl() {
    return `${window.location.origin}/api/account/${this.accountId}/kyc/pdf`;
  }

  componentWillMount() {
    this.loadKyc();
  }

  async loadKyc() {
    const kyc = await this.store.getKyc(this.accountId);
    this.setState({ kyc });
  }

  handleStatusChange = async (status: KycStatus, rejectReason?: string) => {
    const isChanged = await this.store.changeKycStatus(this.accountId, status, rejectReason);

    if (isChanged) {
      notification.success({
        message: `KYC status successfully changed to ${status}`,
      });

      this.setState({ kyc: {
        ...this.state.kyc,
        status,
        rejectReason,
      }});
    } else {
      notification.error({
        message: 'Something went wrong! KYC status not changed.',
      });
    }
  };

  render() {
    const { kyc } = this.state;

    return (
      <React.Fragment>
        <div className='d-flex justify-content-between'>
          {kyc ?
            <KycInfo kyc={kyc} />
            :
            <Spin tip='Loading kyc...'/>
          }

          {kyc && kyc.status === KycStatus.Tier1Pending &&
          <ChangeKycStatus changeStatus={this.handleStatusChange}/>
          }
        </div>

        <KycPDF pdfURL={this.pdfUrl} />
      </React.Fragment>
    );
  }
}

export default KycContainer;