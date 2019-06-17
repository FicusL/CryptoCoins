import * as React from 'react';
import Layout from './Layout';
import { FormattedMessage } from 'react-intl';


class RefundPolicy extends React.Component {

  render() {
    return (
      
      <Layout>

        <h1 className='policy-page__title'>
          <FormattedMessage id='policyPages.refundSecurity.title' />
        </h1>
        <h3 className='policy-page__subtitle'>
          <FormattedMessage id='policyPages.0' />
        </h3>
        <p>
          <FormattedMessage id='policyPages.refundSecurity.part0.1' />
        </p>
        <ul className='policy-page__unordered-list'>
          <li>
            <FormattedMessage id='policyPages.refundSecurity.part0.2.1' />
          </li>
          <li>
            <FormattedMessage id='policyPages.refundSecurity.part0.2.2' />
          </li>
          <li>
            <FormattedMessage id='policyPages.refundSecurity.part0.2.3' />
          </li>
        </ul>



        <h3 className='policy-page__subtitle'>
          <FormattedMessage id='policyPages.refundSecurity.subtitle.1' />
        </h3>
        <p>
          <FormattedMessage id='policyPages.refundSecurity.part1.1' />
        </p>
        <p>
          <FormattedMessage id='policyPages.refundSecurity.part1.2' />
        </p>
        <p>
          <FormattedMessage id='policyPages.refundSecurity.part1.3' />
        </p>
        <p>
          <FormattedMessage id='policyPages.refundSecurity.part1.4' />
        </p>



        <h3 className='policy-page__subtitle'>
          <FormattedMessage id='policyPages.refundSecurity.subtitle.2' />
        </h3>
        <p>
          <FormattedMessage id='policyPages.refundSecurity.part2.1' />
        </p>
        <p>
          <FormattedMessage id='policyPages.refundSecurity.part2.2' />
        </p>



        <h3 className='policy-page__subtitle'>
          <FormattedMessage id='policyPages.refundSecurity.subtitle.3' />
        </h3>
        <p>
          <FormattedMessage id='policyPages.refundSecurity.part3.1' />
        </p>



        <h3 className='policy-page__subtitle'>
          <FormattedMessage id='policyPages.refundSecurity.subtitle.4' />
        </h3>
        <p>
          <FormattedMessage id='policyPages.refundSecurity.part4.1' />
        </p>
        <p>
          <FormattedMessage id='policyPages.refundSecurity.part4.2' />
        </p>



        <h3 className='policy-page__subtitle'>
          <FormattedMessage id='policyPages.refundSecurity.subtitle.5' />
        </h3>
        <p>
          <FormattedMessage id='policyPages.refundSecurity.part5.1' />
        </p>
        <p>
          <FormattedMessage id='policyPages.refundSecurity.part5.2' />
        </p>
        <p>
          <FormattedMessage id='policyPages.refundSecurity.part5.3' />
        </p>
      </Layout>
    );
  }
}

export default RefundPolicy;