import * as React from 'react';
import { lazyInject } from '../../../../IoC';
import { AccountStore } from '../../Profile/stores/AccountStore';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';

class ReferralProgram extends React.Component<RouteComponentProps> {

  @lazyInject(AccountStore)
  private readonly store: AccountStore;

  handleClick = () => {
    this.props.history.replace('/dashboard/transactions');
  };

  render() {
    const { referralsCount, exchangeCommissionCoefficient } = this.store;

    return (
      <div className='row referral-program'>

        <div className='col-12 mb-2'>
          <h2 className='header text-center text-md-left mb-2'>
            <FormattedMessage id='referralProgram.title' defaultMessage='Referral Program'/>
          </h2>
        </div>

        <div className='col-12 mb-4'>
          <FormattedMessage id='referralProgram.intro' />
        </div>

        <div className='col-12 mb-2'>
          <h2 className='header text-center text-md-left'>
            <FormattedMessage id='referralProgram.rewards.title' defaultMessage='Rewards' />
          </h2>
        </div>
        <div className='col-12 mb-4'>
          <FormattedMessage id='referralProgram.rewards.description' />
        </div>

        <div className='col-12 mb-2'>
          <h2 className='header text-center text-md-left'>
            <FormattedMessage id='referralProgram.shareYourLink.title' defaultMessage='Share your link' />
          </h2>
        </div>
        <div className='col-12 mb-4'>
          <FormattedMessage id='referralProgram.shareYourLink.description' />
          <br/>
          <p style={{fontWeight: 600}}>
            {`${window.location.origin}/register/referral/${this.store.referralToken}`}
          </p>
        </div>

        <div className='col-12 mb-2'>
          <h2 className='header text-center text-md-left'>
            <FormattedMessage
              id='referralProgram.termsAndConditions.title'
              defaultMessage='Referral Program Terms and Conditions' />
          </h2>
        </div>
        <div className='col-12 mb-4'>
          <FormattedMessage id='referralProgram.termsAndCondition.intro' />
        </div>

        <div className='col-12 mb-4'>
          <ol style={{lineHeight: '25px'}}>
            <li>1. <FormattedMessage id='referralProgram.programTerms.part.1' /></li>
            <li>2. <FormattedMessage id='referralProgram.programTerms.part.2' /></li>
            <li>3. <FormattedMessage id='referralProgram.programTerms.part.3' /></li>
            <li>4. <FormattedMessage id='referralProgram.programTerms.part.4' /></li>
            <li>5. <FormattedMessage id='referralProgram.programTerms.part.5' /></li>
            <li>6. <FormattedMessage id='referralProgram.programTerms.part.6' /></li>
            <li>
              7. <FormattedMessage id='referralProgram.programTerms.part.7' />
              <ol>
                <li>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  a) <FormattedMessage id='referralProgram.programTerms.part.7.a' />
                </li>
                <li>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  b) <FormattedMessage id='referralProgram.programTerms.part.7.b' />
                </li>
                <li>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  c) <FormattedMessage id='referralProgram.programTerms.part.7.c' />
                </li>
                <li>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  d) <FormattedMessage id='referralProgram.programTerms.part.7.d' />
                </li>
                <li>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  e) <FormattedMessage id='referralProgram.programTerms.part.7.e' />
                </li>
                <li>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  f) <FormattedMessage id='referralProgram.programTerms.part.7.f' />
                </li>
                <li>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  g) <FormattedMessage id='referralProgram.programTerms.part.7.g' />
                </li>
                <li>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  h) <FormattedMessage id='referralProgram.programTerms.part.7.h' />
                </li>
              </ol>
            </li>
            <li>
              8. <FormattedMessage id='referralProgram.programTerms.part.8' />
              <ol>
                <li>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  a) <FormattedMessage id='referralProgram.programTerms.part.8.a' />
                </li>
                <li>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  b) <FormattedMessage id='referralProgram.programTerms.part.8.b' />
                </li>
                <li>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  c) <FormattedMessage id='referralProgram.programTerms.part.8.c' />
                </li>
              </ol>
            </li>
            <li>9. <FormattedMessage id='referralProgram.programTerms.part.9' /></li>
            <li>10. <FormattedMessage id='referralProgram.programTerms.part.10' /></li>
            <li>11. <FormattedMessage id='referralProgram.programTerms.part.11' /></li>
            <li>12. <FormattedMessage id='referralProgram.programTerms.part.12' /></li>
          </ol>
        </div>

        <div className='col-12 referral-program__referral-count'>
          <FormattedMessage id='referralProgram.referralsCount'/>: {referralsCount}
        </div>

      </div>
    );
  }
}

export default withRouter(ReferralProgram);