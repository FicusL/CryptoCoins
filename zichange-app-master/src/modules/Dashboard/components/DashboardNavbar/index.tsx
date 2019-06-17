import * as React from 'react';
import { Navbar } from '../../../Shared/components/Navbar/Navbar';
import { lazyInject } from '../../../IoC';
import { SessionStore } from '../../../Shared/stores/SessionStore';
import LogoutButton from '../../../Shared/components/Navbar/LogoutButton';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { AccountStore } from '../../modules/Profile/stores/AccountStore';
import { KycStatus } from '../../modules/Profile/constants/KycStatus';

interface ILink {
  path: string;
  title: string;
  exact: boolean;
}

class DashboardNavbar extends React.Component<{} & InjectedIntlProps> {
  @lazyInject(SessionStore)
  private readonly sessionStore: SessionStore;

  @lazyInject(AccountStore)
  private readonly accountStore: AccountStore;

  onLogout = () => {
    this.sessionStore.logout();
  };

  render() {
    const { intl } = this.props;
    const kycStatus = this.accountStore.kyc.status;
    const { isPartner, kycForbiddenSend } = this.accountStore;

    const links: ILink[] = [];

    const dashboardLink =  {
      path: '/dashboard',
      title: intl.formatMessage({ id: 'dashboard.main.title' }),
      exact: true,
    };

    const KYCLink =    {
      path: '/dashboard/verification',
      title: intl. formatMessage({id: 'dashboard.KYC.title'}),
      exact: false,
    };

    const transactionsLink = {
      path: '/dashboard/transactions',
      title: intl.formatMessage({ id: 'dashboard.transactions.title' }),
      exact: true,
    };

    const profileLink = {
      path: '/dashboard/profile',
      title: intl.formatMessage({id: 'dashboard.profile.title'}),
      exact: true,
    };

    const referralProgram = {
      path: '/dashboard/referral_program',
      title: intl.formatMessage({id: 'landing.header.referral'}),
      exact: true,
    };

    links.push(dashboardLink);

    const mustShowKycLink =
      kycStatus !== KycStatus.Tier1Pending &&
      kycStatus !== KycStatus.Tier3Approved &&
      !kycForbiddenSend;

    if (mustShowKycLink) {
      links.push(KYCLink);
    }

    links.push(
      transactionsLink,
      profileLink,
    );

    const mobileLinks = new Array(...links);

    if (isPartner) {
      links.push(referralProgram);
    }

    return (
      <Navbar links={links} mobileLinks={mobileLinks}>
        <LogoutButton onLogout={this.onLogout} />
      </Navbar>
    );
  }
}

export default injectIntl<any>(DashboardNavbar);