import './style.scss';
import * as React from 'react';
import Button from '../../../../Shared/components/Buttons/Button';
import { Link } from 'react-router-dom';
import TiersInformationTable from './TiersInformationTable';
import { lazyInject } from '../../../../IoC';
import { AccountStore } from '../../Profile/stores/AccountStore';
import { KycStatus } from '../../Profile/constants/KycStatus';
import { FormattedMessage } from 'react-intl';


class StartVerification extends React.Component {

  @lazyInject(AccountStore)
  readonly accountStore : AccountStore;

  getTierNumber = () => {
    const kycStatus = this.accountStore.kyc.status;

    if (kycStatus === KycStatus.Unapproved || kycStatus === KycStatus.Tier1Rejected) {
      return 1;
    } else if (kycStatus === KycStatus.Tier1Approved || kycStatus === KycStatus.Tier2Rejected) {
      return 2;
    } else {
      return 3;
    }
  };

  render() {
    const tierNumber = this.getTierNumber();

    return (
      <div className='verify-identity'>
        <h2 className='container verify-identity__title font-responsive__title mb-3'>
          <FormattedMessage id='dashboard.kyc.verifyTitle' defaultMessage='Verify your identity' />
        </h2>
        <div className='row'>

          <div className='col-lg-4 d-flex justify-content-center'>
            <div className='verify-identity__card'>
              <i className='icon icon-security' />
              <div className='col advantage'>
                <h3 className='advantage-title'>
                  <FormattedMessage id='dashboard.kyc.advantageTitle1' defaultMessage='SECURITY' />
                </h3>
                <p className='advantage-description'>
                  <FormattedMessage
                    id='dashboard.kyc.advantageDescription1'
                    defaultMessage='All provided information is encrypted and securely stored.' />
                </p>
              </div>
            </div>
          </div>

          <div className='col-md-6 col-lg-4 d-flex justify-content-center'>
            <div className='verify-identity__card'>
              <i className='icon icon-simple' />
              <div className='col advantage'>
                <h3 className='advantage-title'>
                  <FormattedMessage id='dashboard.kyc.advantageTitle2' defaultMessage='SIMPLE' />
                </h3>
                <p className='advantage-description'>
                  <FormattedMessage
                    id='dashboard.kyc.advantageDescription2'
                    defaultMessage='Verification process is very simple and it would not take you much time.' />
                </p>
              </div>
            </div>
          </div>

          <div className='col-md-6 col-lg-4 d-flex justify-content-center'>
            <div className='verify-identity__card'>
              <i className='icon icon-compliant' />
              <div className='col advantage'>
                <h3 className='advantage-title'>
                  <FormattedMessage id='dashboard.kyc.advantageTitle3' defaultMessage='COMPLIANT' />
                </h3>
                <p className='advantage-description'>
                  <FormattedMessage
                    id='dashboard.kyc.advantageDescription3'
                    defaultMessage='Verification procedure is fully compliant with AML and KYC regulations' />
                </p>
              </div>
            </div>
          </div>

        </div>

        <TiersInformationTable />

        <div className='text--center mt-5'>
          <Link to={`/dashboard/verification/tier${tierNumber}`}>
            <Button name='white'>
              <FormattedMessage id='dashboard.kyc.startVerificationButton_part1' defaultMessage='Start Tier '/>
              <span>{tierNumber + ' '}</span>
              <FormattedMessage id='dashboard.kyc.startVerificationButton_part2' defaultMessage=' Verification'/>
            </Button> 
          </Link>
        </div>

      </div>
    );
  }
}

export default StartVerification;