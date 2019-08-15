import * as React from 'react';
import moment from 'moment';
import { KycModel } from '../../model/KycModel';


interface IProps {
  kyc: KycModel;
}

class KycInfo extends React.Component<IProps> {

  render() {
    const { kyc } = this.props;

    return (
      <div>
        <h2>Account ID: {kyc.accountId}</h2>
        <p>Account email: {kyc.accountEmail}</p>
        <p>Creation date: {moment(kyc.createDate).format('DD.MM.YYYY | HH:mm:ss')}</p>
        <p>Type: {kyc.accountType}</p>
        <p>Status: {kyc.status}</p>
        {kyc.sumSubInfo && kyc.sumSubInfo.amlReason && <p>Moderation reason: {kyc.sumSubInfo.amlReason}</p>}
        {kyc.sumSubInfo && kyc.sumSubInfo.clientReason && <p>Client reason: {kyc.sumSubInfo.clientReason}</p>}
      </div>
    );
  }
}

export default KycInfo;
