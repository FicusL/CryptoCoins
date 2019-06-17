import * as React from 'react';
import { Link } from 'react-router-dom';
import { AccountStore } from '../../../Dashboard/modules/Profile/stores/AccountStore';
import { lazyInject } from '../../../IoC';
import { KycStatus } from '../../../Dashboard/modules/Profile/constants/KycStatus';
import Tooltip from '../Tooltip/Tooltip';
import { observer } from 'mobx-react';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';

@observer
class AccountLevel extends React.Component<InjectedIntlProps> {
  @lazyInject(AccountStore)
  private readonly accountStore: AccountStore;

  constructor(props) {
    super(props);
  }

  render() {
    const { intl } = this.props;

    const currentTier  = {
      [KycStatus.Unapproved]: intl.formatMessage({
        id: 'dashboard.kyc.unverified',
        defaultMessage: 'Unverified',
      }),
      [KycStatus.Tier1Approved]: intl.formatMessage({
        id: 'dashboard.kyc.tier1',
        defaultMessage: 'Tier 1',
      }),
      [KycStatus.Tier1Pending]: intl.formatMessage({
        id: 'dashboard.kyc.tier1.pending',
        defaultMessage: 'Tier 1 Pending',
      }),
      [KycStatus.Tier1Rejected]: intl.formatMessage({
        id: 'dashboard.kyc.tier1.rejected',
        defaultMessage: 'Tier 1 Rejected',
      }),
      [KycStatus.Tier2Rejected]: intl.formatMessage({
        id: 'dashboard.kyc.tier2.rejected',
        defaultMessage: 'Tier 2 Rejected',
      }),
      [KycStatus.Tier2Approved]: intl.formatMessage({
        id: 'dashboard.kyc.tier2',
        defaultMessage: 'Tier 2',
      }),
      [KycStatus.Tier3Rejected]: intl.formatMessage({
        id: 'dashboard.kyc.tier3.rejected',
        defaultMessage: 'Tier 3 Rejected',
      }),
      [KycStatus.Tier3Approved]: intl.formatMessage({
        id: 'dashboard.kyc.tier3',
        defaultMessage: 'Tier 3',
      }),
    };

    const kycStatus = this.accountStore.kycStatus;
    const kycForbiddenSend = this.accountStore.kycForbiddenSend;
    const isKYCRejected = kycStatus === KycStatus.Tier1Rejected || kycStatus === KycStatus.Tier2Rejected;
    const isKYCUnapproved = kycStatus === KycStatus.Unapproved;

    const rejectedKYCLinks = {
      [KycStatus.Unapproved]: '/dashboard/verification/tier1',
      [KycStatus.Tier1Rejected]: '/dashboard/verification/tier1',
      [KycStatus.Tier2Rejected]: '/dashboard/verification/tier2',
      [KycStatus.Tier3Rejected]: '/dashboard/verification/tier3',
    };

    const retryKYCLink = rejectedKYCLinks[kycStatus];

    const increaseLimitsLinks = {
      [KycStatus.Tier1Approved]: '/dashboard/verification/tier2',
      [KycStatus.Tier2Approved]: '/dashboard/verification/tier3',
    };

    const increaseLimitsLink = increaseLimitsLinks[kycStatus];
    const canIncreaseLimits = kycStatus === KycStatus.Tier1Approved || kycStatus === KycStatus.Tier2Approved;

    const showKycStatusAsLink = (isKYCUnapproved || isKYCRejected) && !kycForbiddenSend;

    return (
      <div className='col-12'>
        <span className='info-strip__account-level'>
          <FormattedMessage id='dashboard.infoStrip.accountLevel' defaultMessage='Account level'/>:&nbsp;
          {showKycStatusAsLink ?
            <Link className='info-strip__account-level info-strip__account-level-increase' to={retryKYCLink}>
              {currentTier[this.accountStore.kyc.status]}
            </Link>
            :
            <>
              {currentTier[this.accountStore.kyc.status]}
            </>
          }
          &nbsp;
          {isKYCRejected && <Tooltip text={this.accountStore.kyc.rejectReason}/>}
        </span>

        {canIncreaseLimits &&
          <Link className='info-strip__account-level info-strip__account-level-increase' to={increaseLimitsLink}>
            <FormattedMessage id='dashboard.infoStrip.increaseLimits' defaultMessage='Increase limits'/>
          </Link>
        }
      </div>
    );
  }
}

export default injectIntl(AccountLevel);