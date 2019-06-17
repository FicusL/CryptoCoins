import * as React from 'react';
import Layout from './Layout';
import { FormattedMessage } from 'react-intl';


class KycAmlPolicy extends React.Component {

  render() {
    return <Layout>
      <h1 className='policy-page__title'>
        <FormattedMessage id='policyPages.kycAmlPolicy.title' />
      </h1>
      <h3 className='policy-page__subtitle'>
        <FormattedMessage id='policyPages.0' />
      </h3>
      <h3 className='policy-page__subtitle'>
        <FormattedMessage id='policyPages.kycAmlPolicy.subtitle.1' />
      </h3>
      <p>
        <FormattedMessage id='policyPages.kycAmlPolicy.part1.1' />
      </p>
      <p>
        <FormattedMessage id='policyPages.kycAmlPolicy.part1.2' />
      </p>
      <p>
        <FormattedMessage id='policyPages.kycAmlPolicy.part1.3' />
      </p>


      <h3 className='policy-page__subtitle'>
        <FormattedMessage id='policyPages.kycAmlPolicy.subtitle.2' />
      </h3>
      <p>
        <FormattedMessage id='policyPages.kycAmlPolicy.part2.1' />
      </p>
      <p>
        <b><FormattedMessage id='policyPages.kycAmlPolicy.part2.2' /></b>
      </p>
      <p>
        <FormattedMessage id='policyPages.kycAmlPolicy.part2.3' />
      </p>
      <p>
        <FormattedMessage id='policyPages.kycAmlPolicy.part2.4' />
      </p>
      <p>
        <FormattedMessage id='policyPages.kycAmlPolicy.part2.5' />
      </p>
      <p>
        <FormattedMessage id='policyPages.kycAmlPolicy.part2.6' />
      </p>



      <h3 className='policy-page__subtitle'>
        <FormattedMessage id='policyPages.kycAmlPolicy.subtitle.3' />
      </h3>
      <p>
        <FormattedMessage id='policyPages.kycAmlPolicy.part3.1' />
      </p>



      <h3 className='policy-page__subtitle'>
        <FormattedMessage id='policyPages.kycAmlPolicy.subtitle.4' />
      </h3>
      <p>
        <FormattedMessage id='policyPages.kycAmlPolicy.part4.1' />
      </p>
      <p>
        <FormattedMessage id='policyPages.kycAmlPolicy.part4.2' />
      </p>
      <ul className='policy-page__unordered-list'>
        <li>
          <FormattedMessage id='policyPages.kycAmlPolicy.part4.3.1' />
        </li>
        <li>
          <FormattedMessage id='policyPages.kycAmlPolicy.part4.3.2' />
        </li>
        <li>
          <FormattedMessage id='policyPages.kycAmlPolicy.part4.3.3' />
        </li>
        <li>
          <FormattedMessage id='policyPages.kycAmlPolicy.part4.3.4' />
        </li>
        <li>
          <FormattedMessage id='policyPages.kycAmlPolicy.part4.3.5' />
        </li>
        <li>
          <FormattedMessage id='policyPages.kycAmlPolicy.part4.3.6' />
        </li>
      </ul>
      <p>
        <FormattedMessage id='policyPages.kycAmlPolicy.part4.4' />
      </p>



      <h3 className='policy-page__subtitle'>
        <FormattedMessage id='policyPages.kycAmlPolicy.subtitle.5' />
      </h3>
      <p>
        <FormattedMessage id='policyPages.kycAmlPolicy.part5.1' />
      </p>
      <p>
        <FormattedMessage id='policyPages.kycAmlPolicy.part5.2' />
      </p>
      <p>
        <FormattedMessage id='policyPages.kycAmlPolicy.part5.3' />
      </p>
      <ul className='policy-page__unordered-list'>
        <li>
          <FormattedMessage id='policyPages.kycAmlPolicy.part5.3.1' />
        </li>
        <li>
          <FormattedMessage id='policyPages.kycAmlPolicy.part5.3.2' />
        </li>
        <li>
          <FormattedMessage id='policyPages.kycAmlPolicy.part5.3.3' />
        </li>
        <li>
          <FormattedMessage id='policyPages.kycAmlPolicy.part5.3.4' />
        </li>
      </ul>
      <p>
        <FormattedMessage id='policyPages.kycAmlPolicy.part5.4' />
      </p>

      <h3 className='policy-page__subtitle'>
        <FormattedMessage id='policyPages.kycAmlPolicy.subtitle.6' />
      </h3>
      <p>
        <FormattedMessage id='policyPages.kycAmlPolicy.part6.1' />
      </p>
      <p>
        <FormattedMessage id='policyPages.kycAmlPolicy.part6.2' />
      </p>
    </Layout>;
  }
}

export default KycAmlPolicy;
