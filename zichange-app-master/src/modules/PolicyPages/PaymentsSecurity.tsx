import * as React from 'react';
import Layout from './Layout';
import { FormattedMessage } from 'react-intl';


class PaymentsSecurity extends React.Component {

  render() {
    return (
      <Layout>

        <h1 className='policy-page__title'>
          <FormattedMessage id='policyPages.paymentsSecurity.title' />
        </h1>
        <h3 className='policy-page__subtitle'>
          <FormattedMessage id='policyPages.0' />
        </h3>
        <h3 className='policy-page__subtitle'>
          <FormattedMessage id='policyPages.paymentsSecurity.subtitle.1' />
        </h3>
        <p>
          <FormattedMessage id='policyPages.paymentsSecurity.part1.1' />
        </p>



        <h3 className='policy-page__subtitle'>
          <FormattedMessage id='policyPages.paymentsSecurity.subtitle.2' />
        </h3>
        <p>
          <FormattedMessage id='policyPages.paymentsSecurity.part2.1' />
        </p>
        <p>
          <FormattedMessage id='policyPages.paymentsSecurity.part2.2' />
        </p>



        <h3 className='policy-page__subtitle'>
          <FormattedMessage id='policyPages.paymentsSecurity.subtitle.3' />
        </h3>
        <p>
          <FormattedMessage id='policyPages.paymentsSecurity.part3.1' />
        </p>
        <p>
          <FormattedMessage id='policyPages.paymentsSecurity.part3.2' />
        </p>
      </Layout>
    );
  }
}

export default PaymentsSecurity;